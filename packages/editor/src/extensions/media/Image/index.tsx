import { DecoratorNode, NodeKey, EditorConfig, LexicalNode, SerializedLexicalNode, Spread, createCommand, COMMAND_PRIORITY_EDITOR, $insertNodes, $isNodeSelection, $getSelection, $getRoot, DOMConversionMap, DOMExportOutput, $isRangeSelection, $createParagraphNode, $getNodeByKey, $setSelection, $createNodeSelection, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND, PASTE_COMMAND, COMMAND_PRIORITY_NORMAL } from 'lexical';
import { ComponentType, CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '../../types';
import { ImagePayload, ImageComponentProps, SerializedImageNode, ImageExtensionConfig, ImageCommands, ImageStateQueries, Alignment } from './types';
import { ImageTranslator, importImageDOM, exportImageDOM, importImageJSON, exportImageJSON } from './ImageTranslator';

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('insert-image');

function ImageComponent({
  src,
  alt,
  caption,
  alignment = 'none',
  className = '',
  style,
  nodeKey,
  width,
  height,
  resizable = true,
  uploading = false,
}: ImageComponentProps) {
  const [editor] = useLexicalComposerContext();
  const imageRef = useRef<HTMLImageElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [currentWidth, setCurrentWidth] = useState<number | 'auto'>(width || 'auto');
  const [currentHeight, setCurrentHeight] = useState<number | 'auto'>(height || 'auto');

  useEffect(() => {
    const img = imageRef.current;
    if (img) {
      img.onload = () => {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      };
    }
  }, [src]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (src && src.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
    };
  }, [src]);

  // Update dimensions when props change
  useEffect(() => {
    setCurrentWidth(width || 'auto');
    setCurrentHeight(height || 'auto');
  }, [width, height]);

  // Listen for selection changes
  useEffect(() => {
    if (!nodeKey) return;
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          const selectedNodes = selection.getNodes();
          setIsSelected(selectedNodes.some(node => node.getKey() === nodeKey));
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [editor, nodeKey]);

  // Handle click to select
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!nodeKey) return;
    editor.update(() => {
      const selection = $createNodeSelection();
      selection.add(nodeKey);
      $setSelection(selection);
    });
  };

  // Resizing logic (unified mouse/touch)
  const startResize = (direction: string) => (event: any) => {
    // Only allow resizing if image has loaded and event is valid
    if (!imageRef.current || !event.target) {
      return;
    }
    
    event.preventDefault();
    setIsResizing(true);
    const startX = 'touches' in event ? event.touches?.[0]?.clientX || 0 : event.clientX;
    const startY = 'touches' in event ? event.touches?.[0]?.clientY || 0 : event.clientY;
    const startWidth = imageRef.current.clientWidth || 100;
    const startHeight = imageRef.current.clientHeight || 100;

    let currentResizeWidth = startWidth;
    let currentResizeHeight = startHeight;

    const onMove = (moveEvent: any) => {
      const x = 'touches' in moveEvent ? moveEvent.touches?.[0]?.clientX || 0 : moveEvent.clientX;
      const y = 'touches' in moveEvent ? moveEvent.touches?.[0]?.clientY || 0 : moveEvent.clientY;
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) newWidth += x - startX;
      if (direction.includes('w')) newWidth += startX - x;
      if (direction.includes('s')) newHeight += y - startY;
      if (direction.includes('n')) newHeight += startY - y;

      // Maintain aspect ratio if shift key is held
      if (moveEvent.shiftKey) {
        newHeight = newWidth / aspectRatio;
      }

      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      currentResizeWidth = newWidth;
      currentResizeHeight = newHeight;

      setCurrentWidth(newWidth);
      setCurrentHeight(newHeight);
    };

    const onUp = () => {
      setIsResizing(false);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey!);
        if (node instanceof ImageNode) {
          // Only update dimensions if they are numbers
          if (typeof currentResizeWidth === 'number' && typeof currentResizeHeight === 'number') {
            node.setWidthAndHeight(currentResizeWidth, currentResizeHeight);
          }
        }
      });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const figureStyle: React.CSSProperties = {
    margin: '1rem 0',
    display: 'block',
    position: 'relative',
    textAlign: alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : alignment === 'center' ? 'center' : 'left',
    ...style
  };

  const imgStyle: React.CSSProperties = {
    maxWidth: '100%',
    display: 'block',
    borderRadius: '4px',
    width: typeof currentWidth === 'number' ? '100%' : currentWidth,
    height: typeof currentHeight === 'number' ? '100%' : currentHeight,
    margin: alignment === 'center' ? '0 auto' : '0',
  };

  const captionStyle: React.CSSProperties = {
    fontSize: '0.9em',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '0.5rem',
    textAlign: 'center'
  };

  return (
    <figure className={`lexical-image align-${alignment} ${className} ${isSelected ? 'selected' : ''} ${isResizing ? 'resizing' : ''} ${uploading ? 'uploading' : ''}`} style={figureStyle} onClick={onClick}>
      <div style={{
        position: 'relative',
        display: alignment === 'center' ? 'inline-block' : 'block',
        float: alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : 'none',
        marginRight: alignment === 'left' ? '1rem' : '0',
        marginLeft: alignment === 'right' ? '1rem' : '0',
        width: currentWidth,
        height: currentHeight,
      }}>
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          style={imgStyle}
        />
        {isSelected && resizable && (
          <>
            <div 
              className="resizer ne" 
              onMouseDown={startResize('ne')} 
              onTouchStart={startResize('ne')}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '10px',
                height: '10px',
                background: '#007acc',
                cursor: 'ne-resize',
                borderRadius: '50%'
              }}
            />
            <div 
              className="resizer nw" 
              onMouseDown={startResize('nw')} 
              onTouchStart={startResize('nw')}
              style={{
                position: 'absolute',
                top: '-5px',
                left: '-5px',
                width: '10px',
                height: '10px',
                background: '#007acc',
                cursor: 'nw-resize',
                borderRadius: '50%'
              }}
            />
            <div 
              className="resizer se" 
              onMouseDown={startResize('se')} 
              onTouchStart={startResize('se')}
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                width: '10px',
                height: '10px',
                background: '#007acc',
                cursor: 'se-resize',
                borderRadius: '50%'
              }}
            />
            <div 
              className="resizer sw" 
              onMouseDown={startResize('sw')} 
              onTouchStart={startResize('sw')}
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '-5px',
                width: '10px',
                height: '10px',
                background: '#007acc',
                cursor: 'sw-resize',
                borderRadius: '50%'
              }}
            />
          </>
        )}
      </div>
      {caption && <figcaption style={captionStyle}>{caption}</figcaption>}
    </figure>
  );
}

let defaultImageComponent: ComponentType<ImageComponentProps> = ImageComponent;

export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __alt: string;
  __caption?: string;
  __alignment: Alignment;
  __className?: string;
  __style?: CSSProperties;
  __width?: number;
  __height?: number;
  __uploading?: boolean;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__caption,
      node.__alignment,
      node.__className,
      node.__style,
      node.__width,
      node.__height,
      node.__uploading,
      node.__key
    );
  }

  // Use new translator
  static importDOM(): DOMConversionMap | null {
    return ImageTranslator.importDOM();
  }

  // Use new translator
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return ImageTranslator.importJSON(serializedNode);
  }

  constructor(
    src: string = '',
    alt: string = '',
    caption?: string,
    alignment: Alignment = 'none',
    className?: string,
    style?: CSSProperties,
    width?: number,
    height?: number,
    uploading?: boolean,
    key?: NodeKey
  ) {
    super(key);
    // Ensure src is not empty
    this.__src = src && src.length > 0 ? src : '';
    this.__alt = alt;
    this.__caption = caption;
    this.__alignment = alignment;
    this.__className = className;
    this.__style = style;
    this.__width = width;
    this.__height = height;
    this.__uploading = uploading;
    console.log('Creating ImageNode:', { src: this.__src, alt: this.__alt, caption: this.__caption, alignment: this.__alignment, uploading: this.__uploading });
  }

  // Required for DecoratorNode: creates the DOM container for the React component
  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const themeClass = config.theme?.image || '';
    div.className = `${themeClass} lexical-image-container align-${this.__alignment}`.trim();
    return div;
  }

  // Required for DecoratorNode: handles updates to the DOM container
  updateDOM(prevNode: ImageNode, dom: HTMLElement, config: EditorConfig): boolean {
    if (this.__alignment !== prevNode.__alignment) {
      const themeClass = config.theme?.image || '';
      dom.className = `${themeClass} lexical-image-container align-${this.__alignment}`.trim();
    }
    console.log('🔄 updateDOM called for ImageNode');
    return false; // No full re-render needed
  }

  // Use new translator
  exportDOM(): DOMExportOutput {
    return ImageTranslator.exportDOM(this);
  }

  // Use new translator
  exportJSON(): SerializedImageNode {
    return ImageTranslator.exportJSON(this);
  }

  setSrc(src: string): void {
    if (!src || src.length === 0) {
      console.warn('Attempted to set empty src on ImageNode');
      return;
    }
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAlt(alt: string): void {
    const writable = this.getWritable();
    writable.__alt = alt;
  }

  setCaption(caption?: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  setAlignment(alignment: Alignment): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  setClassName(className?: string): void {
    const writable = this.getWritable();
    writable.__className = className;
  }

  setStyle(style?: CSSProperties): void {
    const writable = this.getWritable();
    writable.__style = style;
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  // This is the key method - it determines if the node can be selected
  isInline(): boolean {
    return false;
  }

  // This ensures the image node is treated as a block element
  isBlockElement(): boolean {
    return true;
  }

  // This is critical - ensure the node is considered a top-level block
  canBeEmpty(): boolean {
    return false;
  }

  decorate(): ReactNode {
    console.log('🎨 ImageNode.decorate() called for node:', this.__key, {
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
      alignment: this.__alignment,
      isValidSrc: !!this.__src && this.__src.length > 0
    });

    // Ensure we have a valid src
    if (!this.__src || this.__src.length === 0) {
      console.error('❌ No src provided to ImageNode');
      return (
        <div style={{
          color: 'red',
          border: '1px solid red',
          padding: '10px',
          backgroundColor: '#ffe6e6'
        }}>
          Image Error: No source URL provided
        </div>
      );
    }

    try {
      const Component = defaultImageComponent;
      return (
        <Component
          src={this.__src}
          alt={this.__alt}
          caption={this.__caption}
          alignment={this.__alignment}
          className={this.__className}
          style={this.__style}
          nodeKey={this.getKey()}
          width={this.__width}
          height={this.__height}
          resizable={true}
          uploading={this.__uploading}
        />
      );
    } catch (error) {
      console.error('❌ Error rendering ImageNode:', error);
      return (
        <div style={{
          color: 'red',
          border: '1px solid red',
          padding: '10px',
          backgroundColor: '#ffe6e6'
        }}>
          Image Error: {String(error)}
        </div>
      );
    }
  }
}

export function $createImageNode(
  src: string,
  alt: string,
  caption?: string,
  alignment: Alignment = 'none',
  className?: string,
  style?: CSSProperties,
  width?: number,
  height?: number,
  uploading?: boolean
): ImageNode {
  if (!src || src.length === 0) {
    throw new Error('Cannot create ImageNode with empty src');
  }
  return new ImageNode(src, alt, caption, alignment, className, style, width, height, uploading);
}

export class ImageExtension extends BaseExtension<
  'image',
  ImageExtensionConfig,
  ImageCommands,
  ImageStateQueries,
  ReactNode[]
> {
  private recentImages: Set<string> = new Set(); // Track recent image src to prevent duplicates

  constructor() {
    super('image', [ExtensionCategory.Toolbar]);
    this.config = {  // Set defaults
      ...this.config,
      resizable: true,
      pasteListener: { insert: true, replace: true },
      debug: false,
      forceUpload: false,
    };
  }

  configure(config: Partial<ImageExtensionConfig>): this {
    if (config.customRenderer) {
      defaultImageComponent = config.customRenderer;
    }
    if (config.uploadHandler) {
      this.config.uploadHandler = config.uploadHandler;
    }
    if (config.defaultAlignment) {
      this.config.defaultAlignment = config.defaultAlignment;
    }
    if (config.classNames) {
      this.config.classNames = config.classNames;
    }
    if (config.styles) {
      this.config.styles = config.styles;
    }
    // Merge pasteListener with defaults
    this.config.pasteListener = {
      insert: config.pasteListener?.insert ?? this.config.pasteListener?.insert ?? true,
      replace: config.pasteListener?.replace ?? this.config.pasteListener?.replace ?? true,
    };
    this.config.debug = config.debug ?? this.config.debug ?? false;
    this.config = { ...this.config, ...config, resizable: config.resizable ?? true };
    return this;
  }

  register(editor: LexicalEditor): () => void {
    console.log('🔧 Registering ImageExtension');
    const removeCommand = editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        console.log('📸 Inserting image:', payload);
        editor.update(() => {
          try {
            let src = payload.src || (payload.file ? URL.createObjectURL(payload.file) : '');
            if (!src) throw new Error('No src for image');

            // Check for duplicates
            if (this.recentImages.has(src)) {
              console.log('🚫 Duplicate image src detected, skipping:', src);
              return true;
            }
            this.recentImages.add(src);
            // Clear recent images after 1s to allow new insertions
            setTimeout(() => this.recentImages.delete(src), 1000);

            let uploading = false;
            if (payload.file && this.config.uploadHandler && this.config.forceUpload) {
              uploading = true;
              // Async upload
              this.config.uploadHandler(payload.file).then((uploadedSrc) => {
                editor.update(() => {
                  const node = $getNodeByKey(imageNode.getKey());
                  if (node instanceof ImageNode) {
                    node.setSrc(uploadedSrc);
                    node.__uploading = false;
                  }
                });
              }).catch((error) => {
                console.error('Upload failed:', error);
                // Keep blob URL, set uploading to false
                editor.update(() => {
                  const node = $getNodeByKey(imageNode.getKey());
                  if (node instanceof ImageNode) {
                    node.__uploading = false;
                  }
                });
              });
            }

            const imageNode = $createImageNode(
              src,
              payload.alt,
              payload.caption,
              payload.alignment || this.config.defaultAlignment || 'none',
              payload.className,
              payload.style,
              undefined,
              undefined,
              uploading
            );
            
            const selection = $getSelection();
            let inserted = false;
            if ($isRangeSelection(selection)) {
              selection.insertNodes([imageNode]);
              inserted = true;
            }
            
            if (!inserted) {
              const paragraph = $createParagraphNode();
              paragraph.append(imageNode);
              $getRoot().append(paragraph);
              console.log('✅ Appended to root');
              // Add another paragraph after
              const nextPara = $createParagraphNode();
              $getRoot().append(nextPara);
              nextPara.select();
            } else {
              console.log('✅ Inserted via selection');
              // Add paragraph after the image
              const nextPara = $createParagraphNode();
              imageNode.insertAfter(nextPara);
              nextPara.select();
            }
          } catch (error) {
            console.error('❌ Insertion error:', error);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
    console.log('✅ ImageExtension registered');
    const removeDelete = editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          if (nodes.some(node => node instanceof ImageNode)) {
            editor.update(() => {
              nodes.forEach(node => node.remove());
            });
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
    const removeBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          if (nodes.some(node => node instanceof ImageNode)) {
            editor.update(() => {
              nodes.forEach(node => node.remove());
            });
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // New: Paste handler
    let removePaste: () => void = () => {};
    if (this.config.pasteListener?.insert || this.config.pasteListener?.replace) {
      const debugLog = this.config.debug ? console.log : () => {};
      removePaste = editor.registerCommand<ClipboardEvent>(
        PASTE_COMMAND,
        (event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;

          let handled = false;
          const hasHtml = Array.from(items).some(item => item.type === 'text/html');
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              if (hasHtml) {
                // Skip handling image file if HTML is present to avoid duplicate with importDOM
                continue;
              }
              event.preventDefault();
              const file = item.getAsFile();
              if (!file) continue;

              debugLog('📋 Pasting image:', file.name);

              // Get src (upload or local URL)
              const getSrc = this.config.uploadHandler && this.config.forceUpload
                ? this.config.uploadHandler(file).catch((err) => {
                    console.error('Upload failed:', err);
                    return URL.createObjectURL(file);  // Fallback
                  })
                : Promise.resolve(URL.createObjectURL(file));

              getSrc.then((src) => {
                // Skip if recently inserted
                if (this.recentImages.has(src)) {
                  debugLog('🚫 Duplicate paste image src detected, skipping:', src);
                  return;
                }
                this.recentImages.add(src);
                setTimeout(() => this.recentImages.delete(src), 1000);

                let uploading = false;
                let imageNode: ImageNode;
                if (this.config.uploadHandler && this.config.forceUpload && file) {
                  uploading = true;
                  // Async upload
                  this.config.uploadHandler(file).then((uploadedSrc) => {
                    editor.update(() => {
                      const node = $getNodeByKey(imageNode.getKey());
                      if (node instanceof ImageNode) {
                        node.setSrc(uploadedSrc);
                        node.__uploading = false;
                      }
                    });
                  }).catch((error) => {
                    console.error('Upload failed:', error);
                    editor.update(() => {
                      const node = $getNodeByKey(imageNode.getKey());
                      if (node instanceof ImageNode) {
                        node.__uploading = false;
                      }
                    });
                  });
                }

                editor.update(() => {
                  const selection = $getSelection();
                  const alt = file.name || 'Pasted image';

                  if ($isNodeSelection(selection) && this.config.pasteListener?.replace) {
                    const nodes = selection.getNodes();
                    const existingImageNode = nodes.find((node) => node instanceof ImageNode) as ImageNode | undefined;
                    if (existingImageNode) {
                      debugLog('🔄 Replacing selected image src');
                      existingImageNode.setSrc(src);
                      existingImageNode.__uploading = uploading;
                      handled = true;
                      return;
                    }
                  }

                  if (this.config.pasteListener?.insert) {
                    debugLog('➕ Inserting new pasted image');
                    imageNode = $createImageNode(src, alt, undefined, 'none', undefined, undefined, undefined, undefined, uploading);
                    if ($isRangeSelection(selection)) {
                      selection.insertNodes([imageNode]);
                    } else {
                      $getRoot().append($createParagraphNode().append(imageNode));
                    }
                    handled = true;
                  }
                });
              });
              break;  // Handle only first image
            }
          }
          return handled;  // true if we handled it (stops other handlers)
        },
        COMMAND_PRIORITY_NORMAL  // Balanced priority
      );
    }

    return () => {
      removeCommand();
      removeDelete();
      removeBackspace();
      removePaste();
    };
  }

  getNodes(): any[] {
    console.log('📝 ImageExtension getNodes() called, returning ImageNode');
    return [ImageNode];
  }

  getCommands(editor: LexicalEditor): ImageCommands {
    return {
      insertImage: (payload: ImagePayload) => {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
      },
      setImageAlignment: (alignment: Alignment) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            for (const node of nodes) {
              if (node instanceof ImageNode) {
                node.setAlignment(alignment);
              }
            }
          }
        });
      },
      setImageCaption: (caption: string) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            for (const node of nodes) {
              if (node instanceof ImageNode) {
                node.setCaption(caption);
              }
            }
          }
        });
      },
      setImageClassName: (className: string) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            for (const node of nodes) {
              if (node instanceof ImageNode) {
                node.setClassName(className);
              }
            }
          }
        });
      },
      setImageStyle: (style: CSSProperties) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            for (const node of nodes) {
              if (node instanceof ImageNode) {
                node.setStyle(style);
              }
            }
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): ImageStateQueries {
    return {
      imageSelected: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              resolve(nodes.length === 1 && nodes[0] instanceof ImageNode);
            } else {
              resolve(false);
            }
          });
        }),
      isImageAlignedLeft: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && nodes[0] instanceof ImageNode) {
                resolve((nodes[0] as ImageNode).__alignment === 'left');
                return;
              }
            }
            resolve(false);
          });
        }),
      isImageAlignedCenter: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && nodes[0] instanceof ImageNode) {
                resolve((nodes[0] as ImageNode).__alignment === 'center');
                return;
              }
            }
            resolve(false);
          });
        }),
      isImageAlignedRight: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && nodes[0] instanceof ImageNode) {
                resolve((nodes[0] as ImageNode).__alignment === 'right');
                return;
              }
            }
            resolve(false);
          });
        }),
      isImageAlignedNone: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && nodes[0] instanceof ImageNode) {
                resolve((nodes[0] as ImageNode).__alignment === 'none');
                return;
              }
            }
            resolve(false);
          });
        }),
    };
  }
}

export const imageExtension = new ImageExtension();
