import { LexicalEditor, $getNearestNodeFromDOMNode, $getNodeByKey, $isElementNode } from 'lexical';
import React, { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BaseExtension } from '../base/BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '../types';

/**
 * Configuration for the DraggableBlockExtension
 */
export interface DraggableConfig extends BaseExtensionConfig {
  /** Offset for handle positioning */
  handleOffset?: number;
  /** Custom handle renderer for headless customization */
  handleRenderer?: (props: {
    rect: DOMRect;
    isDragging: boolean;
    isHovered: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
  }) => ReactNode;
  /** Custom drag preview renderer */
  dragPreviewRenderer?: (props: {
    element: HTMLElement;
    isDragging: boolean;
  }) => ReactNode;
  /** Anchor element for portal (default: document.body) */
  anchorElem?: HTMLElement;
  /** Show up/down buttons */
  showMoveButtons?: boolean;
  /** Custom up button renderer */
  upButtonRenderer?: (props: { onClick: () => void; disabled?: boolean }) => ReactNode;
  /** Custom down button renderer */
  downButtonRenderer?: (props: { onClick: () => void; disabled?: boolean }) => ReactNode;
  /** Custom drop indicator renderer */
  dropIndicatorRenderer?: (props: { top: number; left: number; width: number }) => ReactNode;
  /** Theme classes */
  theme?: {
    handle?: string;
    handleHover?: string;
    handleDragging?: string;
    blockDragging?: string;
    dropIndicator?: string;
    upButton?: string;
    downButton?: string;
    blockIsDragging?: string;
  };
}

/**
 * Commands provided by the draggable block extension
 */
export type DraggableCommands = {
  /** Move a block programmatically */
  moveBlock: (sourceKey: string, targetKey: string, insertAfter: boolean) => void;
};

/**
 * State queries provided by the draggable block extension
 */
export type DraggableStateQueries = {
  /** Check if currently dragging */
  isDragging: () => Promise<boolean>;
};

/**
 * DraggableBlockExtension - Provides drag and drop functionality for blocks
 */
export class DraggableBlockExtension extends BaseExtension<
  'draggableBlock',
  DraggableConfig,
  DraggableCommands,
  DraggableStateQueries,
  ReactNode[]
> {
  private isDraggingState: boolean = false;

  constructor() {
    super('draggableBlock', [ExtensionCategory.Floating]);
    this.config = {
      showInToolbar: false,
      position: 'after',
      handleOffset: 20,
      anchorElem: undefined, // Will be set to document.body when component mounts
      showMoveButtons: true, // Enable by default
      theme: {
        handle: 'lexkit-draggable-handle',
        handleHover: 'lexkit-draggable-handle-hover',
        handleDragging: 'lexkit-draggable-handle-dragging',
        blockDragging: 'lexkit-draggable-block-dragging opacity-50 transition-opacity duration-200',
        dropIndicator: 'lexkit-draggable-drop-indicator',
        upButton: 'lexkit-draggable-up-button',
        downButton: 'lexkit-draggable-down-button',
        blockIsDragging: 'lexkit-draggable-block-is-dragging',
      },
    } as DraggableConfig;
  }

  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [<DraggableBlockPlugin key="draggable-block" config={this.config} extension={this} />];
  }

  getCommands(editor: LexicalEditor): DraggableCommands {
    return {
      moveBlock: (sourceKey: string, targetKey: string, insertAfter: boolean) => {
        editor.update(() => {
          const sourceNode = $getNodeByKey(sourceKey);
          const targetNode = $getNodeByKey(targetKey);
          if (sourceNode && targetNode && $isElementNode(sourceNode) && $isElementNode(targetNode)) {
            sourceNode.remove();
            if (insertAfter) {
              targetNode.insertAfter(sourceNode);
            } else {
              targetNode.insertBefore(sourceNode);
            }
          }
        });
      }
    };
  }

  getStateQueries(editor: LexicalEditor): DraggableStateQueries {
    return {
      isDragging: async () => this.isDraggingState
    };
  }

  // Method to update dragging state from plugin
  setIsDragging(isDragging: boolean) {
    this.isDraggingState = isDragging;
  }
}

/**
 * Pre-configured draggable block extension instance
 */
export const draggableBlockExtension = new DraggableBlockExtension();

/**
 * Simple throttle function
 */
function throttle<T extends (...args: any[]) => any>(cb: T, ms: number) {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= ms) {
      lastTime = now;
      cb(...args);
    }
  };
}

/**
 * DraggableBlockPlugin component
 */
interface DraggableBlockPluginProps {
  config: DraggableConfig;
  extension: DraggableBlockExtension;
}

function DraggableBlockPlugin({ config, extension }: DraggableBlockPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [hoveredBlock, setHoveredBlock] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{ top: number; left: number; width: number } | null>(null);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const draggedKeyRef = useRef<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  if (typeof document === 'undefined') return null;
  
  const anchorElem = config.anchorElem || document.body;

  useEffect(() => {
    extension.setIsDragging(isDragging);
  }, [isDragging, extension]);

  // Simple mouse tracking for showing handle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Don't track mouse during dragging, but keep the current hovered block
      if (isDragging) {
        return;
      }

      const editorElement = editor.getRootElement();
      if (!editorElement) return;

      const target = e.target as HTMLElement;

      // Check if we're hovering over the drag handle area
      const isOverHandle = target.closest('.drag-handle-area') || target.closest('.drag-handle');

      // Find the block element
      let blockElement: HTMLElement | null = null;
      let current = target;

      while (current && current !== editorElement && current !== document.body) {
        if (current.parentElement === editorElement) {
          blockElement = current;
          break;
        }
        current = current.parentElement!;
      }

      // Clear any existing hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // Set hovered block if we found one or are over the handle area
      if (blockElement || isOverHandle) {
        setHoveredBlock(blockElement || hoveredBlock);
      } else if (!isDragging) {
        // Only hide if not dragging
        hideTimeoutRef.current = setTimeout(() => {
          setHoveredBlock(null);
        }, 200);
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        hideTimeoutRef.current = setTimeout(() => {
          setHoveredBlock(null);
        }, 200);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [editor, isDragging, hoveredBlock]);  const handleDragStart = useCallback((event: React.DragEvent, element: HTMLElement) => {
    console.log('🚀 handleDragStart called', element);
    event.stopPropagation();
    setIsDragging(true);
    setDraggedElement(element);

    // Add dragging classes to the element
    if (config.theme?.blockDragging) {
      const classes = config.theme.blockDragging.split(' ').filter(Boolean);
      element.classList.add(...classes);
    }
    if (config.theme?.blockIsDragging) {
      const classes = config.theme.blockIsDragging.split(' ').filter(Boolean);
      element.classList.add(...classes);
    }

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(element);
      console.log('📝 Found node:', node);
      if (node && $isElementNode(node)) {
        const key = node.getKey();
        draggedKeyRef.current = key;
        event.dataTransfer?.setData('application/x-lexical-drag', JSON.stringify({ key }));
        console.log('✅ Set data for key:', key);
      }
    });

    event.dataTransfer!.effectAllowed = 'move';

    // Create ghost image
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.opacity = '0.5';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);
    event.dataTransfer!.setDragImage(clone, 0, 0);
    setTimeout(() => document.body.removeChild(clone), 0);
  }, [editor, config.theme?.blockDragging, config.theme?.blockIsDragging]);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';

    const target = event.target as HTMLElement;
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    let blockElement: HTMLElement | null = null;
    let current = target;

    while (current && current !== editorElement) {
      if (current.parentElement === editorElement) {
        blockElement = current;
        break;
      }
      current = current.parentElement!;
    }

    if (blockElement) {
      const rect = blockElement.getBoundingClientRect();
      const isAbove = event.clientY < rect.top + rect.height / 2;
      setDropIndicator({
        top: isAbove ? rect.top + window.scrollY : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setDropIndicator(null);
    }
  }, [editor]);

  const handleDrop = useCallback((event: DragEvent) => {
    console.log('🎯 handleDrop called');
    event.preventDefault();
    setIsDragging(false);
    setDropIndicator(null);

    const data = event.dataTransfer?.getData('application/x-lexical-drag');
    console.log('📦 Got data:', data);
    if (!data) return;

    const { key: sourceKey } = JSON.parse(data);
    if (!sourceKey) return;

    const target = event.target as HTMLElement;
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    let targetElement: HTMLElement | null = null;
    let current = target;

    while (current && current !== editorElement) {
      if (current.parentElement === editorElement) {
        targetElement = current;
        break;
      }
      current = current.parentElement!;
    }

    console.log('🎯 Target element:', targetElement);

    if (targetElement) {
      editor.update(() => {
        const sourceNode = $getNodeByKey(sourceKey);
        const targetNode = $getNearestNodeFromDOMNode(targetElement);
        console.log('🔄 Moving:', { sourceNode, targetNode });
        
        if (sourceNode && targetNode && $isElementNode(sourceNode) && $isElementNode(targetNode) && sourceNode.getKey() !== targetNode.getKey()) {
          const rect = targetElement.getBoundingClientRect();
          const insertAfter = event.clientY >= rect.top + rect.height / 2;

          console.log('✅ Actually moving block, insertAfter:', insertAfter);
          sourceNode.remove();
          if (insertAfter) {
            targetNode.insertAfter(sourceNode);
          } else {
            targetNode.insertBefore(sourceNode);
          }
        }
      });
    }

    draggedKeyRef.current = null;
  }, [editor]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDropIndicator(null);
    draggedKeyRef.current = null;

    // Remove dragging classes from the element
    if (draggedElement && config.theme?.blockDragging) {
      const classes = config.theme.blockDragging.split(' ').filter(Boolean);
      draggedElement.classList.remove(...classes);
    }
    if (draggedElement && config.theme?.blockIsDragging) {
      const classes = config.theme.blockIsDragging.split(' ').filter(Boolean);
      draggedElement.classList.remove(...classes);
    }
    setDraggedElement(null);
  }, [draggedElement, config.theme?.blockDragging, config.theme?.blockIsDragging]);

  const handleMoveUp = useCallback(() => {
    if (!hoveredBlock) return;

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredBlock);
      if (node && $isElementNode(node)) {
        const prevSibling = node.getPreviousSibling();
        if (prevSibling && $isElementNode(prevSibling)) {
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
      if (node && $isElementNode(node)) {
        const nextSibling = node.getNextSibling();
        if (nextSibling && $isElementNode(nextSibling)) {
          node.remove();
          nextSibling.insertAfter(node);
        }
      }
    });
  }, [editor, hoveredBlock]);

  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (editorElement) {
      // Prevent text dragging
      const preventDrag = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.drag-handle')) {
          e.preventDefault();
        }
      };

      editorElement.addEventListener('dragstart', preventDrag);
      editorElement.addEventListener('dragover', handleDragOver);
      editorElement.addEventListener('drop', handleDrop);
      editorElement.addEventListener('dragend', handleDragEnd);

      return () => {
        editorElement.removeEventListener('dragstart', preventDrag);
        editorElement.removeEventListener('dragover', handleDragOver);
        editorElement.removeEventListener('drop', handleDrop);
        editorElement.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [editor, handleDragOver, handleDrop, handleDragEnd]);

  // Show handle when hovering over a block or when dragging
  const currentElement = hoveredBlock || draggedElement;
  if (!currentElement) return null;

  const rect = currentElement.getBoundingClientRect();

  return (
    <>
      {/* Large invisible hover area that keeps handle visible */}
      {createPortal(
        <div
          className="drag-handle-area"
          style={{
            position: 'absolute',
            left: rect.left + window.scrollX - 60,
            top: rect.top + window.scrollY - 10,
            width: '80px',
            height: rect.height + 20,
            zIndex: 9999,
            pointerEvents: 'none', // Let mouse events pass through
          }}
        />,
        anchorElem
      )}

      {/* Custom handle renderer or default handle */}
      {config.handleRenderer ? (
        createPortal(
          config.handleRenderer({
            rect,
            isDragging,
            isHovered: true,
            onDragStart: (e) => handleDragStart(e, currentElement),
            onMoveUp: config.showMoveButtons ? handleMoveUp : undefined,
            onMoveDown: config.showMoveButtons ? handleMoveDown : undefined,
          }),
          anchorElem
        )
      ) : (
        /* Default drag handle */
        createPortal(
          <div
            className={`${config.theme?.handle || 'lexkit-draggable-handle'} ${isDragging ? (config.theme?.handleDragging || 'lexkit-draggable-handle-dragging') : ''}`}
            style={{
              position: 'absolute',
              left: rect.left + window.scrollX - 35,
              top: rect.top + window.scrollY + 4,
              width: '28px',
              height: '28px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              userSelect: 'none',
              zIndex: 10000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              fontWeight: '600',
              pointerEvents: 'auto',
              transition: 'all 0.2s ease',
            }}
            contentEditable={false}
            draggable={true}
            onDragStart={(e) => {
              console.log('Drag started on block:', currentElement);
              handleDragStart(e, currentElement);
            }}
            onMouseEnter={() => {
              setHoveredBlock(currentElement);
            }}
          >
            ⋮⋮
          </div>,
          anchorElem
        )
      )}

      {/* Move up/down buttons */}
      {config.showMoveButtons && (
        <>
          {/* Up button */}
          {config.upButtonRenderer ? (
            createPortal(
              config.upButtonRenderer({
                onClick: handleMoveUp,
                disabled: false, // TODO: Check if can move up
              }),
              anchorElem
            )
          ) : (
            createPortal(
              <button
                className={config.theme?.upButton || 'lexkit-draggable-up-button'}
                style={{
                  position: 'absolute',
                  left: rect.left + window.scrollX - 35,
                  top: rect.top + window.scrollY - 24,
                  width: '28px',
                  height: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  zIndex: 10000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.15s ease',
                }}
                onClick={handleMoveUp}
              >
                ↑
              </button>,
              anchorElem
            )
          )}

          {/* Down button */}
          {config.downButtonRenderer ? (
            createPortal(
              config.downButtonRenderer({
                onClick: handleMoveDown,
                disabled: false, // TODO: Check if can move down
              }),
              anchorElem
            )
          ) : (
            createPortal(
              <button
                className={config.theme?.downButton || 'lexkit-draggable-down-button'}
                style={{
                  position: 'absolute',
                  left: rect.left + window.scrollX - 35,
                  top: rect.top + window.scrollY + 36,
                  width: '28px',
                  height: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  zIndex: 10000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.15s ease',
                }}
                onClick={handleMoveDown}
              >
                ↓
              </button>,
              anchorElem
            )
          )}
        </>
      )}

      {/* Custom drop indicator renderer or default */}
      {dropIndicator && (
        config.dropIndicatorRenderer ? (
          createPortal(
            config.dropIndicatorRenderer(dropIndicator),
            anchorElem
          )
        ) : (
          createPortal(
            <div
              className={config.theme?.dropIndicator || 'lexkit-draggable-drop-indicator'}
              style={{
                position: 'absolute',
                top: dropIndicator.top - 1,
                left: dropIndicator.left,
                width: dropIndicator.width,
                height: '3px',
                backgroundColor: '#3b82f6',
                borderRadius: '2px',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
              }}
            />,
            anchorElem
          )
        )
      )}
    </>
  );
}