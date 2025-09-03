import { DecoratorNode, NodeKey, EditorConfig, LexicalNode, SerializedLexicalNode, Spread, createCommand, COMMAND_PRIORITY_EDITOR, $insertNodes, $isNodeSelection, $getSelection } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory, BaseExtensionConfig } from '../../types';
import { ImagePayload, ImageComponentProps, SerializedImageNode, ImageExtensionConfig, ImageCommands, ImageStateQueries, Alignment } from './types';

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('insert-image');

let defaultImageComponent: ComponentType<ImageComponentProps> = ({
  src,
  alt,
  caption,
  alignment = 'none',
  className = '',
  style,
}) => {
  console.log('Rendering defaultImageComponent:', { src, alt, caption, alignment });
  return (
    <figure className={`lexical-image align-${alignment} ${className}`} style={style}>
      <img src={src} alt={alt} />
      {caption && <figcaption>{caption}</figcaption>}
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

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__caption,
      node.__alignment,
      node.__className,
      node.__style,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(
      serializedNode.src,
      serializedNode.alt,
      serializedNode.caption,
      serializedNode.alignment,
      serializedNode.className,
      serializedNode.style
    );
  }

  constructor(
    src: string,
    alt: string,
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

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
      alignment: this.__alignment,
      className: this.__className,
      style: this.__style,
    };
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

  decorate(): ReactNode {
    console.log('Decorating image node:', {
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
      alignment: this.__alignment
    });
    const Component = defaultImageComponent;
    return <Component
      src={this.__src}
      alt={this.__alt}
      caption={this.__caption}
      alignment={this.__alignment}
      className={this.__className}
      style={this.__style}
    />;
  }
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
    const removeCommand = editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        console.log('Inserting image:', payload);
        if (payload.file) {
          this.config.uploadHandler?.(payload.file).then(src => {
            console.log('Upload result:', src);
            editor.update(() => {
              const imageNode = new ImageNode(
                src || '',
                payload.alt,
                payload.caption,
                payload.alignment || this.config.defaultAlignment || 'none',
                payload.className,
                payload.style
              );
              $insertNodes([imageNode]);
              console.log('Image node inserted');
            });
          });
        } else {
          editor.update(() => {
            const imageNode = new ImageNode(
              payload.src || '',
              payload.alt,
              payload.caption,
              payload.alignment || this.config.defaultAlignment || 'none',
              payload.className,
              payload.style
            );
            $insertNodes([imageNode]);
            console.log('Image node inserted from URL');
          });
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return removeCommand;
  }

  getNodes(): any[] {
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
