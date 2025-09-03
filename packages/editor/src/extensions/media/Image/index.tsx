import { DecoratorNode, NodeKey, EditorConfig, LexicalNode, SerializedLexicalNode, Spread, createCommand, COMMAND_PRIORITY_EDITOR, $insertNodes, $isNodeSelection, $getSelection, $getRoot, DOMConversionMap, DOMExportOutput, $isRangeSelection, $createParagraphNode } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '../../types';
import { ImagePayload, ImageComponentProps, SerializedImageNode, ImageExtensionConfig, ImageCommands, ImageStateQueries, Alignment } from './types';
import { ImageTranslator, importImageDOM, exportImageDOM, importImageJSON, exportImageJSON } from './ImageTranslator';

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('insert-image');

let defaultImageComponent: ComponentType<ImageComponentProps> = ({
  src,
  alt,
  caption,
  alignment = 'none',
  className = '',
  style,
}) => {
  console.log('🖼️ Rendering defaultImageComponent:', { src, alt, caption, alignment });

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', src, e);
  };

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', src);
  };

  // Add some basic styling to make sure the image is visible
  const figureStyle: CSSProperties = {
    margin: '1rem 0',
    display: 'block',
    textAlign: alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : alignment === 'center' ? 'center' : 'left',
    ...style
  };

  const imgStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    border: '1px solid #ddd', // Add border to see if element is rendered
    borderRadius: '4px',
  };

  const captionStyle: CSSProperties = {
    fontSize: '0.9em',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '0.5rem',
    textAlign: 'center'
  };

  return (
    <figure className={`lexical-image align-${alignment} ${className}`} style={figureStyle}>
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={imgStyle}
      />
      {caption && <figcaption className="image-caption" style={captionStyle}>{caption}</figcaption>}
    </figure>
  );
};

export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __alt: string;
  __caption?: string;
  __alignment: Alignment;
  __className?: string;
  __style?: CSSProperties;

  static getType(): string {
    return 'image';
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
    key?: NodeKey
  ) {
    super(key);
    console.log('Creating ImageNode:', { src, alt, caption, alignment });
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
    this.__alignment = alignment;
    this.__className = className;
    this.__style = style;
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
  style?: CSSProperties
): ImageNode {
  return new ImageNode(src, alt, caption, alignment, className, style);
}

export class ImageExtension extends BaseExtension<
  'image',
  ImageExtensionConfig,
  ImageCommands,
  ImageStateQueries,
  ReactNode[]
> {
  constructor() {
    super('image', [ExtensionCategory.Toolbar]);
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
    this.config = { ...this.config, ...config };
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
            const src = payload.src || (payload.file ? URL.createObjectURL(payload.file) : '');
            if (!src) throw new Error('No src for image');
            
            const imageNode = $createImageNode(
              src,
              payload.alt,
              payload.caption,
              payload.alignment || this.config.defaultAlignment || 'none',
              payload.className,
              payload.style
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
            } else {
              console.log('✅ Inserted via selection');
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
    return removeCommand;
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
