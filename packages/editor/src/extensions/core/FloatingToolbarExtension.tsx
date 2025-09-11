import { LexicalEditor, $getSelection, $isRangeSelection, $isNodeSelection, RangeSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BaseExtension } from '@lexkit/editor/extensions/base/BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '@lexkit/editor/extensions/types';

/**
 * Selection rect with position information
 */
export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/**
 * Floating toolbar render props - fully typed and headless
 */
export interface FloatingToolbarRenderProps<TCommands = any, TStates = any> {
  /** Whether the toolbar should be visible */
  isVisible: boolean;
  /** Selection rectangle for positioning */
  selectionRect: SelectionRect | null;
  /** Current selection object */
  selection: RangeSelection | null;
  /** Lexical editor instance */
  editor: LexicalEditor;
  /** Type-safe commands from the editor system */
  commands: TCommands;
  /** Active states from the editor system */
  activeStates: TStates;
  /** Callback to hide the toolbar */
  hide: () => void;
}

/**
 * Configuration for the FloatingToolbarExtension
 */
export interface FloatingConfig<TCommands = any, TStates = any> extends BaseExtensionConfig {
  /**
   * Headless render function - you have complete control over UI
   */
  render: (props: FloatingToolbarRenderProps<TCommands, TStates>) => ReactNode | null;

  /**
   * Function to get type-safe commands from the editor system
   */
  getCommands?: () => TCommands;

  /**
   * Function to get active states from the editor system
   */
  getActiveStates?: () => TStates;

  /**
   * Anchor element for the portal (defaults to document.body)
   */
  anchorElem?: HTMLElement;

  /**
   * Debounce time for selection changes (default: 100ms)
   */
  debounceMs?: number;

  /**
   * Offset from selection (default: { x: 0, y: 8 })
   */
  offset?: { x: number; y: number };

  /**
   * Position strategy (default: 'below')
   */
  positionStrategy?: 'above' | 'below' | 'auto';
}

/**
 * Commands provided by the floating toolbar extension (none by default)
 */
export type FloatingCommands = {};

/**
 * State queries provided by the floating toolbar extension
 */
export type FloatingStateQueries = {
  isFloatingVisible: () => Promise<boolean>;
};

/**
 * FloatingToolbarExtension - Clean, headless floating toolbar that appears on text selection
 *
 * Features:
 * - 🎯 Truly headless: Complete UI control via render prop
 * - 🔧 Framework agnostic: Works with any UI library (shadcn, Material-UI, etc.)
 * - 📱 Smart positioning: Auto-calculates position with customizable strategies
 * - ⚡ Performance optimized: Debounced updates, efficient rendering
 * - 🎨 Fully customizable: Position, styling, behavior all under your control
 * - 🛡️ Type-safe: Strongly typed props and configuration
 *
 * Usage:
 * ```tsx
 * floatingToolbarExtension.configure({
 *   render: ({ isVisible, selectionRect, selection, editor, commands, activeStates, hide }) => {
 *     if (!isVisible || !selectionRect) return null;
 *
 *     return (
 *       <MyToolbar
 *         position={{ x: selectionRect.x, y: selectionRect.bottom + 8 }}
 *         onBold={() => commands.formatText('bold')}
 *         onClose={hide}
 *       />
 *     );
 *   },
 *   positionStrategy: 'below',
 *   offset: { x: 0, y: 8 }
 * })
 * ```
 */
export class FloatingToolbarExtension<TCommands = any, TStates = any> extends BaseExtension<
  'floatingToolbar',
  FloatingConfig<TCommands, TStates>,
  FloatingCommands,
  FloatingStateQueries,
  ReactNode[]
> {
  private isVisible: boolean = false;
  private selectionRect: SelectionRect | null = null;

  constructor() {
    super('floatingToolbar', [ExtensionCategory.Floating]);
    this.config = {
      render: () => null,
      debounceMs: 100,
      offset: { x: 0, y: 8 },
      positionStrategy: 'below'
    } as FloatingConfig<TCommands, TStates>;
  }

  register(editor: LexicalEditor): () => void {
    // No global registrations needed; handled in plugin
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [<FloatingToolbarPlugin key="floating-toolbar" extension={this} config={this.config} />];
  }

  getCommands(editor: LexicalEditor): FloatingCommands {
    return {};
  }

  getStateQueries(editor: LexicalEditor): FloatingStateQueries {
    return {
      isFloatingVisible: async () => this.isVisible,
    };
  }

  /**
   * Update the configuration with commands and activeStates
   */
  updateContext(commands: TCommands, activeStates: TStates) {
    if (this.config) {
      this.config.commands = commands;
      this.config.activeStates = activeStates;
    }
  }

  /**
   * Get the current selection rectangle
   */
  getSelectionRect(): SelectionRect | null {
    return this.selectionRect;
  }

  /**
   * Check if the floating toolbar is currently visible
   */
  getIsVisible(): boolean {
    return this.isVisible;
  }

  setVisible(visible: boolean) {
    this.isVisible = visible;
  }

  setSelectionRect(rect: SelectionRect | null) {
    this.selectionRect = rect;
  }
}

/**
 * Pre-configured instance
 */
export const floatingToolbarExtension = new FloatingToolbarExtension();

/**
 * Plugin component - handles selection detection and headless rendering
 */
interface FloatingToolbarPluginProps<TCommands = any, TStates = any> {
  extension: FloatingToolbarExtension<TCommands, TStates>;
  config: FloatingConfig<TCommands, TStates>;
}

function FloatingToolbarPlugin<TCommands = any, TStates = any>({ extension, config }: FloatingToolbarPluginProps<TCommands, TStates>) {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [selection, setSelection] = useState<RangeSelection | null>(null);

  // Debounce utility
  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Convert DOMRect to SelectionRect with positioning
  const createSelectionRect = (domRect: DOMRect): SelectionRect => {
    const offset = config.offset || { x: 0, y: 8 };
    const strategy = config.positionStrategy || 'below';
    
    // Add scroll offset to get absolute position
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    let y = domRect.bottom + scrollY + offset.y;
    if (strategy === 'above') {
      y = domRect.top + scrollY - offset.y;
    } else if (strategy === 'auto') {
      // Auto position based on viewport
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - domRect.bottom;
      const spaceAbove = domRect.top;
      y = spaceBelow > 60 ? domRect.bottom + scrollY + offset.y : domRect.top + scrollY - offset.y;
    }

    return {
      x: domRect.left + scrollX + domRect.width / 2 + offset.x,
      y,
      width: domRect.width,
      height: domRect.height,
      top: domRect.top + scrollY,
      left: domRect.left + scrollX,
      bottom: domRect.bottom + scrollY,
      right: domRect.right + scrollX
    };
  };

  // Update extension state
  useEffect(() => {
    extension.setVisible(isVisible);
  }, [isVisible, extension]);

  // Listen for editor updates to detect selection changes
  useEffect(() => {
    const updateSelection = () => {
      editor.getEditorState().read(() => {
        const sel = $getSelection();
        let newRect: DOMRect | null = null;
        let rangeSelection: RangeSelection | null = null;

        if ($isRangeSelection(sel) && !sel.isCollapsed()) {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0);
            newRect = domRange.getBoundingClientRect();
            rangeSelection = sel;
          }
        } else if ($isNodeSelection(sel)) {
          const nodes = sel.getNodes();
          if (nodes.length > 0) {
            const node = nodes[0];
            if (node) {
              const key = node.getKey();
              const domElement = editor.getElementByKey(key);
              if (domElement) {
                newRect = domElement.getBoundingClientRect();
              }
            }
          }
        }

        if (newRect && newRect.width > 0 && newRect.height > 0) {
          const rect = createSelectionRect(newRect);
          setSelectionRect(rect);
          setSelection(rangeSelection);
          setIsVisible(true);
          extension.setSelectionRect(rect);
        } else {
          setSelectionRect(null);
          setSelection(null);
          setIsVisible(false);
          extension.setSelectionRect(null);
        }
      });
    };

    const debouncedUpdate = debounce(updateSelection, config.debounceMs || 100);

    const unregister = editor.registerUpdateListener(() => {
      debouncedUpdate();
    });

    // Listen for selection changes outside of editor updates
    const handleSelectionChange = () => {
      debouncedUpdate();
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      unregister();
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [editor, config.debounceMs]);

  // Hide callback
  const hide = () => {
    setIsVisible(false);
    setSelectionRect(null);
    setSelection(null);
  };

  // Require render function to be provided
  if (!config.render) {
    console.warn('FloatingToolbarExtension: No render function provided in config.');
    return null;
  }

  // SSR safety
  if (typeof document === 'undefined') return null;

  const anchorElem = config.anchorElem || document.body;

  return createPortal(
    config.render({
      isVisible,
      selectionRect,
      selection,
      editor,
      commands: config.getCommands?.() || ({} as TCommands),
      activeStates: config.getActiveStates?.() || ({} as TStates),
      hide
    }),
    anchorElem
  );
}