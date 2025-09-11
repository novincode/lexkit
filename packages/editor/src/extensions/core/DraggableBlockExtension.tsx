import { LexicalEditor, $getNearestNodeFromDOMNode, $getNodeByKey, $isElementNode } from 'lexical';
import React, { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BaseExtension } from '../base/BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '../types';

/**
 * Debounce utility for performance optimization
 */
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
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
    buttonStackPosition?: 'left' | 'right';
    /** Enable dragging via text selection (default: true) */
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
            showUpButton: true,
            showDownButton: true,
            buttonStackPosition: 'left',
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
        return () => { };
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
    const [dropIndicator, setDropIndicator] = useState<{ top: number; left: number; width: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const draggedElementRef = useRef<HTMLElement | null>(null);
    const draggedKeyRef = useRef<string | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentElementRef = useRef<HTMLElement | null>(null);

    // SSR safety
    if (typeof document === 'undefined') return null;
    const anchorElem = config.anchorElem || document.body;

    // Update extension state
    useEffect(() => {
        extension.setIsDragging(isDragging);
    }, [isDragging, extension]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    // Manage visibility for smooth animations
    useEffect(() => {
        if (hoveredBlock || draggedElementRef.current || currentElementRef.current) {
            setIsVisible(true);
        } else {
            // Delay hiding for smooth fade-out animation, but not during transitions
            if (!isTransitioning) {
                const timeout = setTimeout(() => setIsVisible(false), 300);
                return () => clearTimeout(timeout);
            }
        }
    }, [hoveredBlock, draggedElementRef.current, currentElementRef.current, isTransitioning]);

    // Auto-hide handle after successful drop
    useEffect(() => {
        if (currentElementRef.current && !isDragging && !hoveredBlock) {
            const timeout = setTimeout(() => {
                setHoveredBlock(null);
                currentElementRef.current = null;
                setIsVisible(false);
            }, 10000); // Increased from 1.5s to 3s for smoother connected flow

            return () => clearTimeout(timeout);
        }
    }, [isDragging, hoveredBlock]);

    // Re-arrange elements after drop or resize with smooth transition
    const rearrangeElements = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        setIsTransitioning(true);

        animationFrameRef.current = requestAnimationFrame(() => {
            // Simple smooth transition
            setTimeout(() => {
                setIsTransitioning(false);
            }, 400);
        });
    }, []);

    // Debounced resize handler
    const handleResize = useCallback(debounce(() => {
        rearrangeElements();
    }, 150), [rearrangeElements]);

    // Clean up drag classes helper
    const cleanupDragClasses = useCallback((element: HTMLElement) => {
        if (!element || !config.theme?.blockDragging) return;

        const classes = config.theme.blockDragging.includes(' ')
            ? config.theme.blockDragging.split(' ').filter(Boolean)
            : [config.theme.blockDragging];

        classes.forEach(cls => element.classList.remove(cls));
    }, [config.theme]);

    // Apply drag classes helper
    const applyDragClasses = useCallback((element: HTMLElement) => {
        if (!element || !config.theme?.blockDragging) return;

        const classes = config.theme.blockDragging.includes(' ')
            ? config.theme.blockDragging.split(' ').filter(Boolean)
            : [config.theme.blockDragging];

        classes.forEach(cls => element.classList.add(cls));
    }, [config.theme]);

    // Mouse tracking for handle visibility with smooth positioning
    useEffect(() => {
        let hideTimeout: NodeJS.Timeout;
        let positionUpdateFrame: number;

        const updateHandlePosition = () => {
            if (hoveredBlock || currentElementRef.current) {
                const element = hoveredBlock || currentElementRef.current;
                if (element && element instanceof HTMLElement && typeof element.getBoundingClientRect === 'function') {
                    // Update position smoothly using animation frame
                    positionUpdateFrame = requestAnimationFrame(() => {
                        // Simple re-render trigger
                        setHoveredBlock(prev => prev === element ? element : prev);
                    });
                }
            }
        };

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
                if (blockElement && blockElement !== hoveredBlock && !currentElementRef.current) {
                    setHoveredBlock(blockElement);
                    updateHandlePosition();
                }
            } else if (!currentElementRef.current) {
                // Delay hiding the handle to make it easier to catch
                hideTimeout = setTimeout(() => {
                    setHoveredBlock(null);
                }, 500); // Increased from 100ms to 500ms for smoother flow
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
                }, 1000); // Increased from 300ms to 1000ms for connected flow
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
            if (positionUpdateFrame) {
                cancelAnimationFrame(positionUpdateFrame);
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

        // Don't clear refs immediately - let rearrange function use them
        setTimeout(() => {
            draggedElementRef.current = null;
            draggedKeyRef.current = null;
            currentElementRef.current = null;
        }, 100);
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

                // Smooth transition to new position
                setTimeout(() => {
                    if (draggedKeyRef.current) {
                        try {
                            const newElement = editor.getElementByKey(draggedKeyRef.current);
                            if (newElement && newElement instanceof HTMLElement && typeof newElement.getBoundingClientRect === 'function') {
                                setHoveredBlock(newElement);
                                currentElementRef.current = newElement;
                                rearrangeElements();
                            }
                        } catch (error) {
                            console.warn('Error finding moved element:', error);
                        }
                    }
                }, 50);
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

        // Add resize listener with debounce
        window.addEventListener('resize', handleResize);

        return () => {
            editorElement.removeEventListener('dragstart', handleDragStart);
            editorElement.removeEventListener('dragover', handleDragOver);
            editorElement.removeEventListener('drop', handleDrop);
            editorElement.removeEventListener('dragend', cleanupDragState);
            window.removeEventListener('resize', handleResize);

            // Cleanup animation frame and timeout
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [editor, cleanupDragState, handleTextSelectionDragStart, config.enableTextSelectionDrag, handleResize]);

    // Don't render if no hovered block and not dragging
    const currentElement = hoveredBlock || draggedElementRef.current || currentElementRef.current;

    // Ensure we have a valid DOM element with getBoundingClientRect method
    if (!currentElement || typeof currentElement.getBoundingClientRect !== 'function') {
        return null;
    }

    const rect = currentElement.getBoundingClientRect();

    // Don't render if element is not visible or has no dimensions
    if (!rect.width || !rect.height) {
        return null;
    }

    return (
        <>
            {/* Modern 2025 CSS animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes float-in {
            0% { 
              opacity: 0; 
              transform: translateY(20px) translateX(-10px) scale(0.8) rotate(-5deg); 
              filter: blur(4px);
            }
            50% { 
              opacity: 0.7; 
              transform: translateY(-5px) translateX(5px) scale(1.05) rotate(2deg); 
              filter: blur(1px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) translateX(0) scale(1) rotate(0deg); 
              filter: blur(0px);
            }
          }
          
          @keyframes smooth-reposition {
            0% { 
              opacity: 0.8;
              transform: scale(0.95) translateY(-10px);
            }
            50% { 
              opacity: 0.6;
              transform: scale(1.1) translateY(5px);
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes float-out {
            0% { 
              opacity: 1; 
              transform: translateY(0) translateX(0) scale(1) rotate(0deg); 
              filter: blur(0px);
            }
            100% { 
              opacity: 0; 
              transform: translateY(-10px) translateX(10px) scale(0.9) rotate(3deg); 
              filter: blur(2px);
            }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1);
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2);
            }
          }
          
          @keyframes bounce-in-modern {
            0% { 
              opacity: 0; 
              transform: scale(0.3) translateY(30px); 
            }
            50% { 
              opacity: 0.8; 
              transform: scale(1.1) translateY(-5px); 
            }
            70% { 
              transform: scale(0.95) translateY(2px); 
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
          }
          
          @keyframes slide-up {
            0% { 
              opacity: 0; 
              transform: translateY(15px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes slide-down {
            0% { 
              opacity: 0; 
              transform: translateY(-15px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .lexkit-drag-button-stack {
            animation: float-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          
          .lexkit-drag-button-stack.fade-out {
            animation: float-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .lexkit-drag-button-stack.repositioning {
            animation: smooth-reposition 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .lexkit-drag-handle.dragging {
            animation: pulse-glow 1.5s ease-in-out infinite;
          }
          
          .lexkit-drag-button:hover {
            animation: bounce-in-modern 0.3s ease-out;
          }
        `
            }} />

            {/* Modern Glassmorphism Button Stack */}
            {createPortal(
                <div
                    className={`lexkit-drag-button-stack ${!isVisible ? 'fade-out' : ''} ${isTransitioning ? 'repositioning' : ''}`}
                    style={{
                        position: 'absolute',
                        left: config.buttonStackPosition === 'right'
                            ? rect.right + window.scrollX + 10
                            : rect.left + window.scrollX - 50,
                        top: rect.top + window.scrollY,
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '6px',
                        alignItems: 'center',
                        pointerEvents: 'auto',
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        perspective: '1000px',
                        transition: isTransitioning ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                >
                    {/* Move Buttons Container - Vertical Stack */}
                    <div
                        className="lexkit-move-buttons-container"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            alignItems: 'center',
                        }}
                    >
                        {/* Up Button - Modern Design */}
                        {(config.showMoveButtons !== false && config.showUpButton !== false) && (
                            <button
                                className={`lexkit-drag-button lexkit-move-up ${config.theme?.upButton || ''}`.trim()}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.85) 100%)',
                                    border: '1px solid rgba(226, 232, 240, 0.6)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    transform: 'translateZ(0)',
                                    animation: 'slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both',
                                }}
                                onClick={handleMoveUp}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(-1px) scale(1.1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 249, 255, 0.98) 0%, rgba(224, 242, 254, 0.95) 50%, rgba(219, 234, 254, 0.9) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                                    e.currentTarget.style.color = '#0ea5e9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0) scale(1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.85) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.6)';
                                    e.currentTarget.style.color = '#475569';
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0) scale(0.95) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'translateX(-1px) scale(1.1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 15l-6-6-6 6" />
                                </svg>
                            </button>
                        )}
                        {/* Drag Handle - Ultra Modern */}
                        {config.handleRenderer ? (
                            config.handleRenderer({
                                rect,
                                isDragging,
                                onDragStart: (e) => handleDragStart(e, currentElement),
                            })
                        ) : (
                            <div
                                className={`lexkit-drag-button lexkit-drag-handle drag-handle-modern ${config.theme?.handle} ${isDragging ? 'dragging' : ''}`.trim()}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    background: isDragging
                                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)'
                                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(241, 245, 249, 0.88) 100%)',
                                    border: isDragging
                                        ? '1px solid rgba(59, 130, 246, 0.8)'
                                        : '1px solid rgba(226, 232, 240, 0.5)',
                                    borderRadius: '14px',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isDragging ? '#ffffff' : '#475569',
                                    userSelect: 'none',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isDragging
                                        ? 'scale(1.1) rotate(5deg) translateZ(0)'
                                        : 'scale(1) rotate(0deg) translateZ(0)',
                                    boxShadow: isDragging
                                        ? '0 12px 40px rgba(59, 130, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                        : '0 6px 24px rgba(0, 0, 0, 0.08), 0 3px 12px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    willChange: 'transform, box-shadow',
                                    backfaceVisibility: 'hidden',
                                    animation: 'bounce-in-modern 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                                }}
                                contentEditable={false}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, currentElement)}
                                onMouseEnter={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.transform = 'scale(1.08) rotate(2deg) translateZ(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 249, 255, 0.98) 0%, rgba(224, 242, 254, 0.95) 50%, rgba(219, 234, 254, 0.9) 100%)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
                                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.08), 0 3px 12px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7)';
                                        e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.5)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(241, 245, 249, 0.88) 100%)';
                                    }
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </div>
                        )}

                        {/* Down Button - Modern Design */}
                        {(config.showMoveButtons !== false && config.showDownButton !== false) && (
                            <button
                                className={`lexkit-drag-button lexkit-move-down ${config.theme?.downButton || ''}`.trim()}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.85) 100%)',
                                    border: '1px solid rgba(226, 232, 240, 0.6)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    transform: 'translateZ(0)',
                                    animation: 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
                                }}
                                onClick={handleMoveDown}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(1px) scale(1.1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 249, 255, 0.98) 0%, rgba(224, 242, 254, 0.95) 50%, rgba(219, 234, 254, 0.9) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                                    e.currentTarget.style.color = '#0ea5e9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0) scale(1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.85) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.6)';
                                    e.currentTarget.style.color = '#475569';
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0) scale(0.95) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'translateX(1px) scale(1.1) translateZ(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        )}
                    </div>


                </div>,
                anchorElem
            )}

            {/* Enhanced Drop Indicator */}
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
                                top: dropIndicator.top - 4,
                                left: dropIndicator.left,
                                width: dropIndicator.width,
                                height: '8px',
                                background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 30%, #1e40af 70%, #3b82f6 100%)',
                                borderRadius: '4px',
                                pointerEvents: 'none',
                                zIndex: 9997,
                                boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(59, 130, 246, 0.2)',
                                animation: 'pulse-glow 1.5s ease-in-out infinite',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                willChange: 'box-shadow',
                                backfaceVisibility: 'hidden',
                            }}
                        />,
                        anchorElem
                    )
                )
            )}
        </>
    );
}
