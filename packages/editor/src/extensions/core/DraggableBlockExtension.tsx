import { LexicalEditor, $getNearestNodeFromDOMNode, $getNodeByKey, $isElementNode, $getSelection, $isRangeSelection } from 'lexical';
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
    moveBlock: (sourceKey: string, targetKey: string, insertAfter: boolean) => void;
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
    'draggableBlock',
    DraggableConfig,
    DraggableCommands,
    DraggableStateQueries,
    ReactNode[]
> {
    private isDraggingState: boolean = false;
    private stateChangeCallbacks: Set<() => void> = new Set();

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
                buttonStack: 'lexkit-drag-button-stack',
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
                        const elementNode = $isElementNode(anchorNode) ? anchorNode : anchorNode.getParent();
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
                        const elementNode = $isElementNode(anchorNode) ? anchorNode : anchorNode.getParent();
                        if (elementNode && $isElementNode(elementNode)) {
                            const nextSibling = elementNode.getNextSibling();
                            if (nextSibling) {
                                elementNode.remove();
                                nextSibling.insertAfter(elementNode);
                            }
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
        if (this.isDraggingState !== isDragging) {
            this.isDraggingState = isDragging;
            // Notify all listeners of state change
            this.stateChangeCallbacks.forEach(callback => callback());
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

    // Default styles for UI elements - minimal and functional
    const defaultStyles = {
        handle: {
            cursor: 'grab',
            userSelect: 'none' as const,
        },
        handleActive: {
            cursor: 'grabbing',
        },
        blockDragging: {
            opacity: 0.5,
        },
        dropIndicator: {
            backgroundColor: '#3b82f6',
            borderRadius: '2px',
        },
        upButton: {
            cursor: 'pointer',
        },
        downButton: {
            cursor: 'pointer',
        },
        buttonStack: {},
    };

    // Merged styles - user styles override defaults
    const mergedStyles = {
        handle: { ...defaultStyles.handle, ...config.styles?.handle },
        handleActive: { ...defaultStyles.handleActive, ...config.styles?.handleActive },
        blockDragging: { ...defaultStyles.blockDragging, ...config.styles?.blockDragging },
        dropIndicator: { ...defaultStyles.dropIndicator, ...config.styles?.dropIndicator },
        upButton: { ...defaultStyles.upButton, ...config.styles?.upButton },
        downButton: { ...defaultStyles.downButton, ...config.styles?.downButton },
        buttonStack: { ...defaultStyles.buttonStack, ...config.styles?.buttonStack },
    };

    // SSR safety
    if (typeof document === 'undefined') return null;
    const anchorElem = config.anchorElem || document.body;

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

        // Reset drag styles
        element.style.opacity = '';
    }, [config.theme]);

    // Apply drag classes helper
    const applyDragClasses = useCallback((element: HTMLElement) => {
        if (!element || !config.theme?.blockDragging) return;

        const classes = config.theme.blockDragging.includes(' ')
            ? config.theme.blockDragging.split(' ').filter(Boolean)
            : [config.theme.blockDragging];

        classes.forEach(cls => element.classList.add(cls));

        // Apply drag styles
        Object.assign(element.style, mergedStyles.blockDragging);
    }, [config.theme, mergedStyles.blockDragging]);

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
            if (node) {
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
            if (node) {
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
            {/* Button Stack */}
            {createPortal(
                <div
                    className={`${config.theme?.buttonStack || 'lexkit-drag-button-stack'} ${!isVisible ? 'fade-out' : ''} ${isTransitioning ? 'repositioning' : ''}`}
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
                        ...mergedStyles.buttonStack,
                    }}
                >
                    {/* Move Buttons Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            alignItems: 'center',
                        }}
                    >
                        {/* Up Button */}
                        {(config.showMoveButtons !== false && config.showUpButton !== false) && (
                            config.buttonsRenderer ? (
                                config.buttonsRenderer({
                                    rect,
                                    onMoveUp: handleMoveUp,
                                    onMoveDown: handleMoveDown,
                                    showUp: true,
                                    showDown: false,
                                    upClassName: `lexkit-drag-button ${config.theme?.upButton || 'lexkit-move-up'}`,
                                    downClassName: `lexkit-drag-button ${config.theme?.downButton || 'lexkit-move-down'}`,
                                })
                            ) : (
                                <button
                                    className={`lexkit-drag-button ${config.theme?.upButton || 'lexkit-move-up'}`}
                                    onClick={handleMoveUp}
                                    style={mergedStyles.upButton}
                                >
                                    ↑
                                </button>
                            )
                        )}

                        {/* Drag Handle */}
                        {config.handleRenderer ? (
                            config.handleRenderer({
                                rect,
                                isDragging,
                                onDragStart: (e) => handleDragStart(e, currentElement),
                                className: `lexkit-drag-button ${config.theme?.handle || 'lexkit-drag-handle'} ${isDragging ? (config.theme?.handleActive || 'lexkit-drag-handle-active') : ''}`.trim(),
                            })
                        ) : (
                            <div
                                className={`lexkit-drag-button ${config.theme?.handle || 'lexkit-drag-handle'} ${isDragging ? (config.theme?.handleActive || 'lexkit-drag-handle-active') : ''}`.trim()}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, currentElement)}
                                style={isDragging ? mergedStyles.handleActive : mergedStyles.handle}
                            >
                                ⋮⋮
                            </div>
                        )}

                        {/* Down Button */}
                        {(config.showMoveButtons !== false && config.showDownButton !== false) && (
                            config.buttonsRenderer ? (
                                config.buttonsRenderer({
                                    rect,
                                    onMoveUp: handleMoveUp,
                                    onMoveDown: handleMoveDown,
                                    showUp: false,
                                    showDown: true,
                                    upClassName: `lexkit-drag-button ${config.theme?.upButton || 'lexkit-move-up'}`,
                                    downClassName: `lexkit-drag-button ${config.theme?.downButton || 'lexkit-move-down'}`,
                                })
                            ) : (
                                <button
                                    className={`lexkit-drag-button ${config.theme?.downButton || 'lexkit-move-down'}`}
                                    onClick={handleMoveDown}
                                    style={mergedStyles.downButton}
                                >
                                    ↓
                                </button>
                            )
                        )}
                    </div>
                </div>,
                anchorElem
            )}

            {/* Drop Indicator */}
            {dropIndicator && (
                config.dropIndicatorRenderer ? (
                    createPortal(
                        config.dropIndicatorRenderer({
                            ...dropIndicator,
                            className: config.theme?.dropIndicator || 'lexkit-drop-indicator',
                        }),
                        anchorElem
                    )
                ) : (
                    createPortal(
                        <div
                            className={config.theme?.dropIndicator || 'lexkit-drop-indicator'}
                            style={{
                                position: 'absolute',
                                top: dropIndicator.top - 4,
                                left: dropIndicator.left,
                                width: dropIndicator.width,
                                height: '8px',
                                pointerEvents: 'none',
                                zIndex: 9997,
                                ...mergedStyles.dropIndicator,
                            }}
                        />,
                        anchorElem
                    )
                )
            )}
        </>
    );
}
