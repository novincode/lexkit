import {
  LexicalEditor,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $isElementNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BaseExtension } from "../base/BaseExtension";
import { ExtensionCategory, BaseExtensionConfig } from "../types";
import { useBaseEditor as useEditor } from "../../core/createEditorSystem";

/**
 * Debounce utility for performance optimization
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Configuration for the DraggableBlockExtension
 */
export interface DraggableConfig extends BaseExtensionConfig {
  /** Anchor element for portal (default: document.body) */
  anchorElem?: HTMLElement;
  /** Show up/down buttons */
  showMoveButtons?: boolean;
  /** Show up button specifically */
  showUpButton?: boolean;
  /** Show down button specifically */
  showDownButton?: boolean;
  /** Position of the button stack relative to blocks */
  buttonStackPosition?: "left" | "right";
  /** Enable dragging via text selection (default: true) */
  enableTextSelectionDrag?: boolean;
  /** Configurable offset for left position */
  offsetLeft?: number;
  /** Configurable offset for right position */
  offsetRight?: number;
  /** Theme classes */
  theme?: {
    handle?: string;
    handleActive?: string;
    blockDragging?: string;
    dropIndicator?: string;
    upButton?: string;
    downButton?: string;
    buttonStack?: string;
  };
  /** Custom CSS styles for UI elements */
  styles?: {
    handle?: React.CSSProperties;
    handleActive?: React.CSSProperties;
    blockDragging?: React.CSSProperties;
    dropIndicator?: React.CSSProperties;
    upButton?: React.CSSProperties;
    downButton?: React.CSSProperties;
    buttonStack?: React.CSSProperties;
  };
  /** Custom handle renderer for complete headless control */
  handleRenderer?: (props: {
    rect: DOMRect;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent) => void;
    className: string;
  }) => ReactNode;
  /** Custom up/down button renderer */
  buttonsRenderer?: (props: {
    rect: DOMRect;
    onMoveUp: () => void;
    onMoveDown: () => void;
    showUp: boolean;
    showDown: boolean;
    upClassName: string;
    downClassName: string;
  }) => ReactNode;
  /** Custom drop indicator renderer */
  dropIndicatorRenderer?: (props: {
    top: number;
    left: number;
    width: number;
    className: string;
  }) => ReactNode;
}

/**
 * Commands provided by the draggable block extension
 */
export type DraggableCommands = {
  moveBlock: (
    sourceKey: string,
    targetKey: string,
    insertAfter: boolean,
  ) => void;
  moveCurrentBlockUp: () => void;
  moveCurrentBlockDown: () => void;
};

/**
 * State queries provided by the draggable block extension
 */
export type DraggableStateQueries = {
  isDragging: () => Promise<boolean>;
};

/**
 * DraggableBlockExtension - Clean, headless drag and drop for blocks
 */
export class DraggableBlockExtension extends BaseExtension<
  "draggableBlock",
  DraggableConfig,
  DraggableCommands,
  DraggableStateQueries,
  ReactNode[]
> {
  private isDraggingState: boolean = false;
  private stateChangeCallbacks: Set<() => void> = new Set();

  constructor(config?: Partial<DraggableConfig>) {
    super("draggableBlock", [ExtensionCategory.Floating]);
    this.config = {
      showInToolbar: false,
      position: "after",
      showMoveButtons: true,
      showUpButton: true,
      showDownButton: true,
      buttonStackPosition: "left",
      enableTextSelectionDrag: true,
      offsetLeft: -40,
      offsetRight: 10,
      ...config,
    } as DraggableConfig;
  }

  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [
      <DraggableBlockPlugin
        key="draggable-block"
        config={this.config}
        extension={this}
      />,
    ];
  }

  getCommands(editor: LexicalEditor): DraggableCommands {
    return {
      moveBlock: (
        sourceKey: string,
        targetKey: string,
        insertAfter: boolean,
      ) => {
        editor.update(() => {
          const sourceNode = $getNodeByKey(sourceKey);
          const targetNode = $getNodeByKey(targetKey);
          if (sourceNode && targetNode) {
            sourceNode.remove();
            if (insertAfter) {
              targetNode.insertAfter(sourceNode);
            } else {
              targetNode.insertBefore(sourceNode);
            }
          }
        });
      },
      moveCurrentBlockUp: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const elementNode = $isElementNode(anchorNode)
              ? anchorNode
              : anchorNode.getParent();
            if (elementNode && $isElementNode(elementNode)) {
              const prevSibling = elementNode.getPreviousSibling();
              if (prevSibling) {
                elementNode.remove();
                prevSibling.insertBefore(elementNode);
              }
            }
          }
        });
      },
      moveCurrentBlockDown: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const elementNode = $isElementNode(anchorNode)
              ? anchorNode
              : anchorNode.getParent();
            if (elementNode && $isElementNode(elementNode)) {
              const nextSibling = elementNode.getNextSibling();
              if (nextSibling) {
                elementNode.remove();
                nextSibling.insertAfter(elementNode);
              }
            }
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): DraggableStateQueries {
    return {
      isDragging: async () => this.isDraggingState,
    };
  }

  setIsDragging(isDragging: boolean) {
    if (this.isDraggingState !== isDragging) {
      this.isDraggingState = isDragging;
      // Notify all listeners of state change
      this.stateChangeCallbacks.forEach((callback) => callback());
    }
  }

  onStateChange(callback: () => void): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => this.stateChangeCallbacks.delete(callback);
  }
}

/**
 * Pre-configured instance
 */
export const draggableBlockExtension = new DraggableBlockExtension();

/**
 * Plugin component - handles all drag and drop logic
 */
interface DraggableBlockPluginProps {
  config: DraggableConfig;
  extension: DraggableBlockExtension;
}

function DraggableBlockPlugin({
  config,
  extension,
}: DraggableBlockPluginProps) {
  const [editor] = useLexicalComposerContext();
  const { config: globalConfig, extensions } = useEditor();
  const draggableExt = extensions.find(
    (ext: { name: string }) => ext.name === "draggableBlock",
  ) as DraggableBlockExtension | undefined;
  const draggableConfig = draggableExt?.config as DraggableConfig | undefined;
  const globalDraggableTheme = globalConfig?.theme?.draggable || {};
  const [hoveredBlock, setHoveredBlock] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const draggedElementRef = useRef<HTMLElement | null>(null);
  const draggedKeyRef = useRef<string | null>(null);

  // Sync local isDragging to extension
  useEffect(() => {
    extension.setIsDragging(isDragging);
  }, [isDragging, extension]);

  // SSR safety
  if (typeof document === "undefined") return null;
  const anchorElem =
    draggableConfig?.anchorElem || config.anchorElem || document.body;

  // Default styles for UI elements - minimal and functional
  const defaultStyles = {
    handle: {
      cursor: "grab",
      userSelect: "none" as const,
    },
    handleActive: {
      cursor: "grabbing",
    },
    blockDragging: {
      opacity: 0.5,
    },
    dropIndicator: {
      backgroundColor: "#3b82f6",
      borderRadius: "2px",
    },
    upButton: {
      cursor: "pointer",
    },
    downButton: {
      cursor: "pointer",
    },
    buttonStack: {},
  };

  // Merged styles: extension config -> global theme styles -> defaults
  const mergedStyles = {
    handle: {
      ...defaultStyles.handle,
      ...globalDraggableTheme.styles?.handle,
      ...draggableConfig?.styles?.handle,
    },
    handleActive: {
      ...defaultStyles.handleActive,
      ...globalDraggableTheme.styles?.handleActive,
      ...draggableConfig?.styles?.handleActive,
    },
    blockDragging: {
      ...defaultStyles.blockDragging,
      ...globalDraggableTheme.styles?.blockDragging,
      ...draggableConfig?.styles?.blockDragging,
    },
    dropIndicator: {
      ...defaultStyles.dropIndicator,
      ...globalDraggableTheme.styles?.dropIndicator,
      ...draggableConfig?.styles?.dropIndicator,
    },
    upButton: {
      ...defaultStyles.upButton,
      ...globalDraggableTheme.styles?.upButton,
      ...draggableConfig?.styles?.upButton,
    },
    downButton: {
      ...defaultStyles.downButton,
      ...globalDraggableTheme.styles?.downButton,
      ...draggableConfig?.styles?.downButton,
    },
    buttonStack: {
      ...defaultStyles.buttonStack,
      ...globalDraggableTheme.styles?.buttonStack,
      ...draggableConfig?.styles?.buttonStack,
    },
  };

  // Merged theme classes: extension config -> global theme -> defaults
  const mergedThemeClasses = {
    handle:
      draggableConfig?.theme?.handle ||
      globalDraggableTheme.handle ||
      "lexkit-draggable-handle",
    handleActive:
      draggableConfig?.theme?.handleActive ||
      globalDraggableTheme.handleActive ||
      "lexkit-draggable-handle-active",
    blockDragging:
      draggableConfig?.theme?.blockDragging ||
      globalDraggableTheme.blockDragging ||
      "lexkit-draggable-block-dragging",
    dropIndicator:
      draggableConfig?.theme?.dropIndicator ||
      globalDraggableTheme.dropIndicator ||
      "lexkit-draggable-drop-indicator",
    upButton:
      draggableConfig?.theme?.upButton ||
      globalDraggableTheme.upButton ||
      "lexkit-draggable-up-button",
    downButton:
      draggableConfig?.theme?.downButton ||
      globalDraggableTheme.downButton ||
      "lexkit-draggable-down-button",
    buttonStack:
      draggableConfig?.theme?.buttonStack ||
      globalDraggableTheme.buttonStack ||
      "lexkit-draggable-button-stack",
  };

  // Clean up drag classes helper
  const cleanupDragClasses = useCallback(
    (element: HTMLElement) => {
      if (!element || !mergedThemeClasses.blockDragging) return;

      const classes = mergedThemeClasses.blockDragging.includes(" ")
        ? mergedThemeClasses.blockDragging.split(" ").filter(Boolean)
        : [mergedThemeClasses.blockDragging];

      classes.forEach((cls: string) => element.classList.remove(cls));

      // Reset drag styles
      element.style.opacity = "";
    },
    [mergedThemeClasses],
  );

  // Apply drag classes helper
  const applyDragClasses = useCallback(
    (element: HTMLElement) => {
      if (!element || !mergedThemeClasses.blockDragging) return;

      const classes = mergedThemeClasses.blockDragging.includes(" ")
        ? mergedThemeClasses.blockDragging.split(" ").filter(Boolean)
        : [mergedThemeClasses.blockDragging];

      classes.forEach((cls: string) => element.classList.add(cls));

      // Apply drag styles
      Object.assign(element.style, mergedStyles.blockDragging);
    },
    [mergedThemeClasses, mergedStyles.blockDragging],
  );

  // Clean up drag state
  const cleanupDragState = useCallback(() => {
    if (draggedElementRef.current) {
      cleanupDragClasses(draggedElementRef.current);
    }

    setIsDragging(false);
    setDropIndicator(null);

    // Restore editor focus
    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.focus();
    }

    // Don't clear refs immediately - let the UI update
    setTimeout(() => {
      draggedElementRef.current = null;
      draggedKeyRef.current = null;
    }, 100);
  }, [cleanupDragClasses, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup drag classes
      if (draggedElementRef.current) {
        cleanupDragClasses(draggedElementRef.current);
      }
    };
  }, [cleanupDragClasses]);

  // Manage visibility for smooth animations
  useEffect(() => {
    if (hoveredBlock || draggedElementRef.current) {
      setIsVisible(true);
    } else {
      // Delay hiding the handle to make it easier to catch
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [hoveredBlock, draggedElementRef.current]);

  // Mouse tracking for handle visibility with smooth positioning
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;

      const editorElement = editor.getRootElement();
      if (!editorElement) return;

      const target = e.target as HTMLElement;

      // Check if over handle area or handle itself
      const isOverHandle =
        target &&
        target.closest &&
        (target.closest(".drag-handle-area") ||
          target.closest('[draggable="true"]'));

      // Check if there's a text selection - don't show handle if text is selected
      const selection = window.getSelection();
      const hasTextSelection =
        selection && selection.rangeCount > 0 && !selection.isCollapsed;

      // Find block element
      let blockElement: HTMLElement | null = null;
      let current = target;

      while (
        current &&
        current !== editorElement &&
        current !== document.body
      ) {
        if (current.parentElement === editorElement) {
          blockElement = current;
          break;
        }
        current = current.parentElement!;
      }

      // Clear any existing hide timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      if ((blockElement || isOverHandle) && !hasTextSelection && !isDragging) {
        if (blockElement && blockElement !== hoveredBlock) {
          setHoveredBlock(blockElement);
        }
      } else {
        // Delay hiding the handle to make it easier to catch
        hideTimeout = setTimeout(() => {
          setHoveredBlock(null);
        }, 500);
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        // Clear any existing timeout
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
        // Delay hiding when mouse leaves the entire document
        hideTimeout = setTimeout(() => {
          setHoveredBlock(null);
        }, 300);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [editor, isDragging, hoveredBlock]);

  // Drag start handler for handle
  const handleDragStart = useCallback(
    (event: React.DragEvent, element: HTMLElement) => {
      event.stopPropagation();

      setIsDragging(true);
      draggedElementRef.current = element;

      // Add drag styling
      applyDragClasses(element);

      // Set up drag data
      const key = editor.read(() => {
        const node = $getNearestNodeFromDOMNode(element);
        return node ? node.getKey() : null;
      });

      if (key) {
        draggedKeyRef.current = key;
        event.dataTransfer?.setData(
          "application/x-lexical-drag",
          JSON.stringify({ key }),
        );
      }

      event.dataTransfer!.effectAllowed = "move";

      // Create drag image
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.opacity = "0.6";
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);
      event.dataTransfer!.setDragImage(clone, 0, 0);
      setTimeout(() => document.body.removeChild(clone), 0);

      // Ensure editor retains focus
      const editorElement = editor.getRootElement();
      if (editorElement) {
        editorElement.focus();
      }
    },
    [editor, applyDragClasses],
  );

  // Handle touch events for mobile drag support (handle and long press on text)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, element: HTMLElement) => {
      // Prevent default to avoid scrolling
      e.preventDefault();

      setIsDragging(true);
      draggedElementRef.current = element;
      applyDragClasses(element);

      // Set up drag data
      const key = editor.read(() => {
        const node = $getNearestNodeFromDOMNode(element);
        return node ? node.getKey() : null;
      });

      if (key) {
        draggedKeyRef.current = key;
      }
    },
    [editor, applyDragClasses],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !draggedElementRef.current) return;

      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      const editorElement = editor.getRootElement();
      if (!editorElement) return;

      let blockElement: HTMLElement | null = null;
      const target = document.elementFromPoint(
        touch.clientX,
        touch.clientY,
      ) as HTMLElement;
      if (target) {
        let current = target;
        while (current && current !== editorElement) {
          if (current.parentElement === editorElement) {
            blockElement = current;
            break;
          }
          current = current.parentElement!;
        }
      }

      if (blockElement && blockElement !== draggedElementRef.current) {
        const rect = blockElement.getBoundingClientRect();
        const isAbove = touch.clientY < rect.top + rect.height / 2;
        setDropIndicator({
          top: isAbove
            ? rect.top + window.scrollY
            : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      } else {
        setDropIndicator(null);
      }
    },
    [editor, isDragging],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !draggedKeyRef.current) {
        return; // Just return without cleanup/focus when not dragging
      }

      e.preventDefault();

      const touch = e.changedTouches[0];
      if (!touch) return;

      const editorElement = editor.getRootElement();
      if (!editorElement) return;

      let targetElement: HTMLElement | null = null;
      const target = document.elementFromPoint(
        touch.clientX,
        touch.clientY,
      ) as HTMLElement;
      if (target) {
        let current = target;
        while (current && current !== editorElement) {
          if (current.parentElement === editorElement) {
            targetElement = current;
            break;
          }
          current = current.parentElement!;
        }
      }

      if (targetElement && targetElement !== draggedElementRef.current) {
        editor.update(() => {
          const sourceNode = $getNodeByKey(draggedKeyRef.current!);
          const targetNode = $getNearestNodeFromDOMNode(targetElement);

          if (sourceNode && targetNode) {
            const rect = targetElement.getBoundingClientRect();
            const insertAfter = touch.clientY >= rect.top + rect.height / 2;

            sourceNode.remove();
            if (insertAfter) {
              targetNode.insertAfter(sourceNode);
            } else {
              targetNode.insertBefore(sourceNode);
            }
          }
        });

        // Smooth transition to new position
        setTimeout(() => {
          if (draggedKeyRef.current) {
            try {
              const newElement = editor.getElementByKey(draggedKeyRef.current);
              if (
                newElement &&
                newElement instanceof HTMLElement &&
                typeof newElement.getBoundingClientRect === "function"
              ) {
                setHoveredBlock(newElement);
              }
            } catch (error) {
              console.warn("Error finding moved element:", error);
            }
          }
        }, 50);
      }

      cleanupDragState();
    },
    [editor, isDragging, cleanupDragState],
  );

  // Move handlers
  const handleMoveUp = useCallback(() => {
    if (!hoveredBlock) return;

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredBlock);
      if (node) {
        const prevSibling = node.getPreviousSibling();
        if (prevSibling) {
          node.remove();
          prevSibling.insertBefore(node);
        }
      }
    });
  }, [editor, hoveredBlock]);

  const handleMoveDown = useCallback(() => {
    if (!hoveredBlock) return;

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredBlock);
      if (node) {
        const nextSibling = node.getNextSibling();
        if (nextSibling) {
          node.remove();
          nextSibling.insertAfter(node);
        }
      }
    });
  }, [editor, hoveredBlock]);

  // Drag event handlers (desktop)
  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const handleDragStartEvent = (e: DragEvent) => {
      let targetNode = e.target as Node;
      if (targetNode.nodeType !== Node.ELEMENT_NODE) {
        targetNode = targetNode.parentNode as Node;
      }
      if (!targetNode || !(targetNode instanceof HTMLElement)) {
        e.preventDefault();
        return;
      }
      const target = targetNode as HTMLElement;

      if (target.closest('[draggable="true"]')) {
        // From handle - let its onDragStart handle it
        return;
      }

      const selection = window.getSelection();
      if (
        !selection ||
        selection.isCollapsed ||
        !(
          draggableConfig?.enableTextSelectionDrag ??
          config.enableTextSelectionDrag
        )
      ) {
        e.preventDefault();
        return;
      }

      // Find block from anchor node
      let current: Node | null = selection.anchorNode;
      if (current?.nodeType === Node.TEXT_NODE) {
        current = current.parentNode;
      }
      let blockElement: HTMLElement | null = null;
      while (current && current !== editorElement) {
        if (current.parentNode === editorElement) {
          blockElement = current as HTMLElement;
          break;
        }
        current = current.parentNode;
      }

      if (!blockElement) {
        e.preventDefault();
        return;
      }

      // Collapse selection to a caret to minimize default drag image
      selection.collapse(selection.anchorNode, selection.anchorOffset);

      // Get node key synchronously
      const key = editor.read(
        () => $getNearestNodeFromDOMNode(blockElement!)?.getKey() ?? null,
      );
      if (!key) {
        e.preventDefault();
        return;
      }

      // Clear all existing dataTransfer data (removes text/plain etc.)
      e.dataTransfer!.clearData();

      // Set custom data
      e.dataTransfer!.setData(
        "application/x-lexical-drag",
        JSON.stringify({ key }),
      );

      // Set effect
      e.dataTransfer!.effectAllowed = "move";

      // Create custom drag image from block clone
      const clone = blockElement.cloneNode(true) as HTMLElement;
      clone.style.opacity = "0.6";
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);
      e.dataTransfer!.setDragImage(clone, 0, 0);
      setTimeout(() => document.body.removeChild(clone), 0);

      // Set dragging state
      setIsDragging(true);
      draggedElementRef.current = blockElement;
      applyDragClasses(blockElement);
      draggedKeyRef.current = key;

      // Do NOT preventDefault - allow native drag to proceed with our customizations
    };

    const handleDragOver = (event: DragEvent) => {
      let targetNode = event.target as Node;
      if (targetNode.nodeType !== Node.ELEMENT_NODE) {
        targetNode = targetNode.parentNode as Node;
      }
      if (!targetNode || !(targetNode instanceof HTMLElement)) {
        return;
      }
      const target = targetNode as HTMLElement;

      event.preventDefault();
      event.dataTransfer!.dropEffect = "move";

      let blockElement: HTMLElement | null = null;
      let current = target;

      while (current && current !== editorElement) {
        if (current.parentElement === editorElement) {
          blockElement = current;
          break;
        }
        current = current.parentElement!;
      }

      if (blockElement && blockElement !== draggedElementRef.current) {
        const rect = blockElement.getBoundingClientRect();
        const isAbove = event.clientY < rect.top + rect.height / 2;
        setDropIndicator({
          top: isAbove
            ? rect.top + window.scrollY
            : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      } else {
        setDropIndicator(null);
      }
    };

    const handleDrop = (event: DragEvent) => {
      let targetNode = event.target as Node;
      if (targetNode.nodeType !== Node.ELEMENT_NODE) {
        targetNode = targetNode.parentNode as Node;
      }
      if (!targetNode || !(targetNode instanceof HTMLElement)) {
        return;
      }
      const target = targetNode as HTMLElement;

      event.preventDefault();

      // Clean up UI immediately
      setDropIndicator(null);

      const data = event.dataTransfer?.getData("application/x-lexical-drag");
      if (!data) {
        cleanupDragState();
        return;
      }

      const { key: sourceKey } = JSON.parse(data);
      if (!sourceKey) {
        cleanupDragState();
        return;
      }

      let targetElement: HTMLElement | null = null;
      let current = target;

      while (current && current !== editorElement) {
        if (current.parentElement === editorElement) {
          targetElement = current;
          break;
        }
        current = current.parentElement!;
      }

      if (targetElement && targetElement !== draggedElementRef.current) {
        editor.update(() => {
          const sourceNode = $getNodeByKey(sourceKey);
          const targetNode = $getNearestNodeFromDOMNode(targetElement);

          if (sourceNode && targetNode) {
            const rect = targetElement.getBoundingClientRect();
            const insertAfter = event.clientY >= rect.top + rect.height / 2;

            sourceNode.remove();
            if (insertAfter) {
              targetNode.insertAfter(sourceNode);
            } else {
              targetNode.insertBefore(sourceNode);
            }
          }
        });

        // Smooth transition to new position
        setTimeout(() => {
          if (draggedKeyRef.current) {
            try {
              const newElement = editor.getElementByKey(draggedKeyRef.current);
              if (
                newElement &&
                newElement instanceof HTMLElement &&
                typeof newElement.getBoundingClientRect === "function"
              ) {
                setHoveredBlock(newElement);
              }
            } catch (error) {
              console.warn("Error finding moved element:", error);
            }
          }
          // Restore editor focus after drop
          const editorElement = editor.getRootElement();
          if (editorElement) {
            editorElement.focus();
          }
        }, 50);
      }

      cleanupDragState();
    };

    editorElement.addEventListener("dragstart", handleDragStartEvent);
    editorElement.addEventListener("dragover", handleDragOver);
    editorElement.addEventListener("drop", handleDrop);
    editorElement.addEventListener("dragend", cleanupDragState);

    return () => {
      editorElement.removeEventListener("dragstart", handleDragStartEvent);
      editorElement.removeEventListener("dragover", handleDragOver);
      editorElement.removeEventListener("drop", handleDrop);
      editorElement.removeEventListener("dragend", cleanupDragState);
    };
  }, [
    editor,
    cleanupDragState,
    applyDragClasses,
    draggableConfig?.enableTextSelectionDrag,
    config.enableTextSelectionDrag,
  ]);

  // Touch event handlers for long press on text (mobile)
  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    let pressTimeout: NodeJS.Timeout | null = null;
    let startX = 0;
    let startY = 0;

    const handleTouchStartEvent = (e: TouchEvent) => {
      if (
        e.touches.length !== 1 ||
        !(
          draggableConfig?.enableTextSelectionDrag ??
          config.enableTextSelectionDrag
        )
      )
        return;

      const touch = e.touches[0];
      if (!touch) return;

      let targetNode = e.target as Node;
      if (targetNode.nodeType !== Node.ELEMENT_NODE) {
        targetNode = targetNode.parentNode as Node;
      }
      if (!targetNode || !(targetNode instanceof HTMLElement)) {
        return;
      }
      const target = targetNode as HTMLElement;

      if (target.closest('[draggable="true"]')) return; // Handle has its own touchstart

      startX = touch.clientX;
      startY = touch.clientY;

      pressTimeout = setTimeout(() => {
        pressTimeout = null;

        // Find block from target
        let blockElement: HTMLElement | null = null;
        let current = target;
        while (current && current !== editorElement) {
          if (current.parentElement === editorElement) {
            blockElement = current;
            break;
          }
          current = current.parentElement!;
        }

        if (!blockElement) return;

        // Collapse any existing selection
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          selection.collapseToStart();
        }

        // Set dragging state
        setIsDragging(true);
        draggedElementRef.current = blockElement;
        applyDragClasses(blockElement);

        // Get key
        const key = editor.read(
          () => $getNearestNodeFromDOMNode(blockElement!)?.getKey() ?? null,
        );
        if (key) draggedKeyRef.current = key;
      }, 500); // Long press duration
    };

    const handleTouchMoveEvent = (e: TouchEvent) => {
      if (pressTimeout && e.touches.length === 1) {
        const touch = e.touches[0];
        if (!touch) return;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.sqrt(dx * dx + dy * dy) > 10) {
          clearTimeout(pressTimeout);
          pressTimeout = null;
        }
      }
    };

    const handleTouchEndEvent = (e: TouchEvent) => {
      if (pressTimeout) {
        clearTimeout(pressTimeout);
        pressTimeout = null;
      }
    };

    editorElement.addEventListener("touchstart", handleTouchStartEvent, {
      passive: false,
    });
    editorElement.addEventListener("touchmove", handleTouchMoveEvent, {
      passive: false,
    });
    editorElement.addEventListener("touchend", handleTouchEndEvent, {
      passive: false,
    });

    // Global touchmove/touchend for drag simulation
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      editorElement.removeEventListener("touchstart", handleTouchStartEvent);
      editorElement.removeEventListener("touchmove", handleTouchMoveEvent);
      editorElement.removeEventListener("touchend", handleTouchEndEvent);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    editor,
    applyDragClasses,
    cleanupDragState,
    isDragging,
    handleTouchMove,
    handleTouchEnd,
    draggableConfig?.enableTextSelectionDrag,
    config.enableTextSelectionDrag,
  ]);

  // Don't render if no hovered block and not dragging
  const currentElement = hoveredBlock || draggedElementRef.current;

  // Ensure we have a valid DOM element with getBoundingClientRect method
  if (
    !currentElement ||
    typeof currentElement.getBoundingClientRect !== "function"
  ) {
    return null;
  }

  const rect = currentElement.getBoundingClientRect();

  // Don't render if element is not visible or has no dimensions
  if (!rect.width || !rect.height) {
    return null;
  }

  return (
    <>
      {/* Button Stack */}
      {createPortal(
        <div
          className={`${mergedThemeClasses.buttonStack} ${!isVisible ? "fade-out" : ""}`}
          style={{
            position: "absolute",
            left:
              (draggableConfig?.buttonStackPosition ||
                config.buttonStackPosition) === "right"
                ? rect.right +
                  window.scrollX +
                  (draggableConfig?.offsetRight || config.offsetRight || 10)
                : rect.left +
                  window.scrollX +
                  (draggableConfig?.offsetLeft || config.offsetLeft || -40),
            top: rect.top + window.scrollY,
            zIndex: 40,
            display: "flex",
            flexDirection: "row",
            gap: "6px",
            alignItems: "center",
            pointerEvents: "auto",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            perspective: "1000px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            ...mergedStyles.buttonStack,
          }}
        >
          {/* Move Buttons Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "center",
            }}
          >
            {/* Up Button */}
            {(draggableConfig?.showMoveButtons ?? config.showMoveButtons) !==
              false &&
              (draggableConfig?.showUpButton ?? config.showUpButton) !==
                false &&
              (draggableConfig?.buttonsRenderer || config.buttonsRenderer ? (
                (draggableConfig?.buttonsRenderer || config.buttonsRenderer)!({
                  rect,
                  onMoveUp: handleMoveUp,
                  onMoveDown: handleMoveDown,
                  showUp: true,
                  showDown: false,
                  upClassName: `lexkit-drag-button ${mergedThemeClasses.upButton}`,
                  downClassName: `lexkit-drag-button ${mergedThemeClasses.downButton}`,
                })
              ) : (
                <button
                  className={`lexkit-drag-button ${mergedThemeClasses.upButton}`}
                  onClick={handleMoveUp}
                  style={mergedStyles.upButton}
                >
                  ↑
                </button>
              ))}

            {/* Drag Handle */}
            {draggableConfig?.handleRenderer || config.handleRenderer ? (
              (draggableConfig?.handleRenderer || config.handleRenderer)!({
                rect,
                isDragging,
                onDragStart: (e) => handleDragStart(e, currentElement),
                className:
                  `lexkit-drag-button ${mergedThemeClasses.handle} ${isDragging ? mergedThemeClasses.handleActive : ""}`.trim(),
              })
            ) : (
              <div
                className={`lexkit-drag-button ${mergedThemeClasses.handle} ${isDragging ? mergedThemeClasses.handleActive : ""}`.trim()}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, currentElement)}
                onTouchStart={(e) => handleTouchStart(e, currentElement)}
                style={
                  isDragging ? mergedStyles.handleActive : mergedStyles.handle
                }
              >
                ⋮⋮
              </div>
            )}

            {/* Down Button */}
            {(draggableConfig?.showMoveButtons ?? config.showMoveButtons) !==
              false &&
              (draggableConfig?.showDownButton ?? config.showDownButton) !==
                false &&
              (draggableConfig?.buttonsRenderer || config.buttonsRenderer ? (
                (draggableConfig?.buttonsRenderer || config.buttonsRenderer)!({
                  rect,
                  onMoveUp: handleMoveUp,
                  onMoveDown: handleMoveDown,
                  showUp: false,
                  showDown: true,
                  upClassName: `lexkit-drag-button ${mergedThemeClasses.upButton}`,
                  downClassName: `lexkit-drag-button ${mergedThemeClasses.downButton}`,
                })
              ) : (
                <button
                  className={`lexkit-drag-button ${mergedThemeClasses.downButton}`}
                  onClick={handleMoveDown}
                  style={mergedStyles.downButton}
                >
                  ↓
                </button>
              ))}
          </div>
        </div>,
        anchorElem,
      )}

      {/* Drop Indicator */}
      {dropIndicator &&
        (draggableConfig?.dropIndicatorRenderer || config.dropIndicatorRenderer
          ? createPortal(
              (draggableConfig?.dropIndicatorRenderer ||
                config.dropIndicatorRenderer)!({
                ...dropIndicator,
                className: mergedThemeClasses.dropIndicator,
              }),
              anchorElem,
            )
          : createPortal(
              <div
                className={mergedThemeClasses.dropIndicator}
                style={{
                  position: "absolute",
                  top: dropIndicator.top - 4,
                  left: dropIndicator.left,
                  width: dropIndicator.width,
                  height: "8px",
                  pointerEvents: "none",
                  zIndex: 9997,
                  ...mergedStyles.dropIndicator,
                }}
              />,
              anchorElem,
            ))}
    </>
  );
}
