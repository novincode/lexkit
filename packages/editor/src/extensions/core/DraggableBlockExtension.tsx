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
  /** Anchor element for portal (default: document.body) */
  anchorElem?: HTMLElement;
  /** Show up/down buttons */
  showMoveButtons?: boolean;
  /** Enable dragging via text selection */
  enableTextSelectionDrag?: boolean;
  /** Theme classes */
  theme?: {
    handle?: string;
    handleActive?: string;
    blockDragging?: string;
    dropIndicator?: string;
    upButton?: string;
    downButton?: string;
  };
  /** Custom handle renderer for complete headless control */
  handleRenderer?: (props: {
    rect: DOMRect;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent) => void;
  }) => ReactNode;
  /** Custom up/down button renderer */
  buttonsRenderer?: (props: {
    rect: DOMRect;
    onMoveUp: () => void;
    onMoveDown: () => void;
  }) => ReactNode;
  /** Custom drop indicator renderer */
  dropIndicatorRenderer?: (props: {
    top: number;
    left: number;
    width: number;
  }) => ReactNode;
}

/**
 * Commands provided by the draggable block extension
 */
export type DraggableCommands = {
  moveBlock: (sourceKey: string, targetKey: string, insertAfter: boolean) => void;
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
      showMoveButtons: true,
      enableTextSelectionDrag: true,
      theme: {
        handle: 'lexkit-drag-handle',
        handleActive: 'lexkit-drag-handle-active',
        blockDragging: 'lexkit-block-dragging',
        dropIndicator: 'lexkit-drop-indicator',
        upButton: 'lexkit-move-up',
        downButton: 'lexkit-move-down',
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

  setIsDragging(isDragging: boolean) {
    this.isDraggingState = isDragging;
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

function DraggableBlockPlugin({ config, extension }: DraggableBlockPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [hoveredBlock, setHoveredBlock] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{top: number; left: number; width: number} | null>(null);
  
  const draggedElementRef = useRef<HTMLElement | null>(null);
  const draggedKeyRef = useRef<string | null>(null);
  
  // SSR safety
  if (typeof document === 'undefined') return null;
  const anchorElem = config.anchorElem || document.body;

  // Update extension state
  useEffect(() => {
    extension.setIsDragging(isDragging);
  }, [isDragging, extension]);

  // Clean up drag classes helper
  const cleanupDragClasses = useCallback((element: HTMLElement) => {
    if (!element || !config.theme?.blockDragging) return;
    
    // Handle single class or multiple classes
    const classes = config.theme.blockDragging.includes(' ') 
      ? config.theme.blockDragging.split(' ').filter(Boolean)
      : [config.theme.blockDragging];
      
    classes.forEach(cls => element.classList.remove(cls));
  }, [config.theme]);

  // Apply drag classes helper
  const applyDragClasses = useCallback((element: HTMLElement) => {
    if (!element || !config.theme?.blockDragging) return;
    
    // Handle single class or multiple classes
    const classes = config.theme.blockDragging.includes(' ') 
      ? config.theme.blockDragging.split(' ').filter(Boolean)
      : [config.theme.blockDragging];
      
    classes.forEach(cls => element.classList.add(cls));
  }, [config.theme]);

  // Mouse tracking for handle visibility
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      
      const editorElement = editor.getRootElement();
      if (!editorElement) return;

      const target = e.target as HTMLElement;
      
      // Check if over handle area or handle itself
      const isOverHandle = target && target.closest && 
        (target.closest('.drag-handle-area') || target.closest('[draggable="true"]'));

      // Check if there's a text selection - don't show handle if text is selected
      const selection = window.getSelection();
      const hasTextSelection = selection && selection.rangeCount > 0 && !selection.isCollapsed;

      // Find block element
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
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      if ((blockElement || isOverHandle) && !hasTextSelection) {
        setHoveredBlock(blockElement || hoveredBlock);
      } else {
        // Delay hiding the handle to make it easier to catch
        hideTimeout = setTimeout(() => {
          setHoveredBlock(null);
        }, 300); // 300ms delay before hiding
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

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [editor, isDragging, hoveredBlock]);

  // Drag start handler
  const handleDragStart = useCallback((event: React.DragEvent, element: HTMLElement) => {
    event.stopPropagation();
    
    setIsDragging(true);
    draggedElementRef.current = element;
    
    // Add drag styling
    applyDragClasses(element);

    // Set up drag data
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(element);
      if (node && $isElementNode(node)) {
        const key = node.getKey();
        draggedKeyRef.current = key;
        event.dataTransfer?.setData('application/x-lexical-drag', JSON.stringify({ key }));
      }
    });

    event.dataTransfer!.effectAllowed = 'move';
    
    // Create drag image
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.opacity = '0.6';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);
    event.dataTransfer!.setDragImage(clone, 0, 0);
    setTimeout(() => document.body.removeChild(clone), 0);
  }, [editor, applyDragClasses]);

  // Handle text selection drag start
  const handleTextSelectionDragStart = useCallback((event: DragEvent) => {
    if (!config.enableTextSelectionDrag) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    // Find the block containing the selection
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    let selectedBlock: HTMLElement | null = null;
    const range = selection.getRangeAt(0);
    let current = range.commonAncestorContainer as HTMLElement;

    // If it's a text node, get its parent element
    if (current.nodeType === Node.TEXT_NODE) {
      current = current.parentElement!;
    }

    // Walk up to find the block element
    while (current && current !== editorElement) {
      if (current.parentElement === editorElement) {
        selectedBlock = current;
        break;
      }
      current = current.parentElement!;
    }

    if (!selectedBlock) return;

    // Simple check: if there's any text selected in this block, allow dragging
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // Set drag state
    setIsDragging(true);
    draggedElementRef.current = selectedBlock;
    applyDragClasses(selectedBlock);

    // Set drag data
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(selectedBlock!);
      if (node && $isElementNode(node)) {
        const key = node.getKey();
        draggedKeyRef.current = key;
        event.dataTransfer?.setData('application/x-lexical-drag', JSON.stringify({ key, type: 'text-selection' }));
      }
    });

    event.dataTransfer!.effectAllowed = 'move';

    // Create drag image
    const clone = selectedBlock.cloneNode(true) as HTMLElement;
    clone.style.opacity = '0.6';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);
    event.dataTransfer!.setDragImage(clone, 0, 0);
    setTimeout(() => document.body.removeChild(clone), 0);

    // Clear selection to prevent interference
    selection.removeAllRanges();
  }, [editor, applyDragClasses, config.enableTextSelectionDrag]);

  // Clean up drag state
  const cleanupDragState = useCallback(() => {
    if (draggedElementRef.current) {
      cleanupDragClasses(draggedElementRef.current);
    }
    
    setIsDragging(false);
    setDropIndicator(null);
    draggedElementRef.current = null;
    draggedKeyRef.current = null;
  }, [cleanupDragClasses]);

  // Move handlers
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

  // Drag event handlers
  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer!.dropEffect = 'move';

      const target = event.target as HTMLElement;
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
          top: isAbove ? rect.top + window.scrollY : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      } else {
        setDropIndicator(null);
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      
      // Clean up UI immediately
      setDropIndicator(null);
      
      const data = event.dataTransfer?.getData('application/x-lexical-drag');
      if (!data) {
        cleanupDragState();
        return;
      }

      const { key: sourceKey } = JSON.parse(data);
      if (!sourceKey) {
        cleanupDragState();
        return;
      }

      const target = event.target as HTMLElement;
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
          
          if (sourceNode && targetNode && $isElementNode(sourceNode) && $isElementNode(targetNode)) {
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
      }
      
      cleanupDragState();
    };

    // Handle drag events
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      
      // If it's from a draggable handle, let it proceed normally
      if (target.closest && target.closest('[draggable="true"]')) {
        return;
      }

      // Check for text selection drag
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed && config.enableTextSelectionDrag) {
        handleTextSelectionDragStart(e);
        return;
      }

      // Prevent other drags
      e.preventDefault();
    };

    editorElement.addEventListener('dragstart', handleDragStart);
    editorElement.addEventListener('dragover', handleDragOver);
    editorElement.addEventListener('drop', handleDrop);
    editorElement.addEventListener('dragend', cleanupDragState);

    return () => {
      editorElement.removeEventListener('dragstart', handleDragStart);
      editorElement.removeEventListener('dragover', handleDragOver);
      editorElement.removeEventListener('drop', handleDrop);
      editorElement.removeEventListener('dragend', cleanupDragState);
    };
  }, [editor, cleanupDragState, handleTextSelectionDragStart, config.enableTextSelectionDrag]);

  // Don't render if no hovered block and not dragging
  const currentElement = hoveredBlock || draggedElementRef.current;
  if (!currentElement) return null;

  const rect = currentElement.getBoundingClientRect();

  return (
    <>
      {/* Hover area for handle stability */}
      {createPortal(
        <div
          className="drag-handle-area"
          style={{
            position: 'absolute',
            left: rect.left + window.scrollX - 50,
            top: rect.top + window.scrollY - 5,
            width: '60px',
            height: rect.height + 10,
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        />,
        anchorElem
      )}

      {/* Handle */}
      {config.handleRenderer ? (
        createPortal(
          config.handleRenderer({
            rect,
            isDragging,
            onDragStart: (e) => handleDragStart(e, currentElement),
          }),
          anchorElem
        )
      ) : (
        createPortal(
          <div
            className={`${config.theme?.handle} ${isDragging ? config.theme?.handleActive || '' : ''}`.trim()}
            style={{
              position: 'absolute',
              left: rect.left + window.scrollX - 35,
              top: rect.top + window.scrollY + 4,
              width: '24px',
              height: '24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              userSelect: 'none',
              zIndex: 9999,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: '12px',
              fontWeight: '600',
              pointerEvents: 'auto',
              transition: 'all 0.2s ease',
            }}
            contentEditable={false}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, currentElement)}
          >
            ⋮⋮
          </div>,
          anchorElem
        )
      )}

      {/* Up/Down buttons */}
      {config.showMoveButtons && (
        config.buttonsRenderer ? (
          createPortal(
            config.buttonsRenderer({
              rect,
              onMoveUp: handleMoveUp,
              onMoveDown: handleMoveDown,
            }),
            anchorElem
          )
        ) : (
          <>
            {/* Up button */}
            {createPortal(
              <button
                className={config.theme?.upButton}
                style={{
                  position: 'absolute',
                  left: rect.left + window.scrollX - 35,
                  top: rect.top + window.scrollY - 20,
                  width: '24px',
                  height: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '10px',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  transition: 'all 0.15s ease',
                }}
                onClick={handleMoveUp}
              >
                ↑
              </button>,
              anchorElem
            )}

            {/* Down button */}
            {createPortal(
              <button
                className={config.theme?.downButton}
                style={{
                  position: 'absolute',
                  left: rect.left + window.scrollX - 35,
                  top: rect.top + window.scrollY + 32,
                  width: '24px',
                  height: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '10px',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  transition: 'all 0.15s ease',
                }}
                onClick={handleMoveDown}
              >
                ↓
              </button>,
              anchorElem
            )}
          </>
        )
      )}

      {/* Drop indicator */}
      {dropIndicator && (
        config.dropIndicatorRenderer ? (
          createPortal(
            config.dropIndicatorRenderer(dropIndicator),
            anchorElem
          )
        ) : (
          createPortal(
            <div
              className={config.theme?.dropIndicator}
              style={{
                position: 'absolute',
                top: dropIndicator.top - 2,
                left: dropIndicator.left,
                width: dropIndicator.width,
                height: '4px',
                backgroundColor: '#3b82f6',
                borderRadius: '2px',
                pointerEvents: 'none',
                zIndex: 9997,
                boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)',
              }}
            />,
            anchorElem
          )
        )
      )}
    </>
  );
}
