import { DecoratorNode } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

export interface ImagePayload { src: string; alt: string; caption?: string; }

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __alt: string;
  __caption?: string;

  static getType() { return 'image'; }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__caption, node.__key);
  }

  constructor(src: string, alt: string, caption?: string, key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
  }

  createDOM(config: any) {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__alt;
    img.className = config.nodeClassName || '';
    Object.assign(img.style, config.nodeStyle || {});
    return img;
  }

  updateDOM(prev: ImageNode, dom: HTMLElement) {
    if (prev.__src !== this.__src) {
      (dom as HTMLImageElement).src = this.__src;
    }
    if (prev.__alt !== this.__alt) {
      (dom as HTMLImageElement).alt = this.__alt;
    }
    return false;
  }

  decorate() {
    return <img src={this.__src} alt={this.__alt} />;
  }
}

const ImageUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> = () => {
  const { t, components, commands } = useEditor();

  const insertImage = () => {
    // For now, prompt for URL
    const src = prompt('Enter image URL');
    if (src) {
      commands.insertNode?.('image', { src, alt: 'Image' });
    }
  };

  const Button = components.Button;

  return (
    <Button onClick={insertImage}>
      {t('image.upload')}
    </Button>
  );
};

export class ImageExtension extends BaseExtension<{ onUpload?: (file: File) => Promise<string>; uploadOnPaste?: boolean; showInToolbar?: boolean }> {
  constructor() {
    super('image', [ExtensionCategory.Toolbar]);
    this.config = { uploadOnPaste: true, showInToolbar: true };
  }

  register(editor: LexicalEditor): () => void {
    // Commands are registered here
    // editor.registerCommand('INSERT_IMAGE_COMMAND' as any, (payload: ImagePayload) => {
    //   editor.update(() => {
    //     const node = new ImageNode(payload.src, payload.alt, payload.caption);
    //     // Insert at selection
    //   });
    //   return true;
    // }, 4);

    // TODO: Add paste listener for images

    return () => {};
  }

  getNodes(): any[] {
    return [ImageNode];
  }

  getUI(): ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null {
    return this.config.showInToolbar ? ImageUI : null;
  }
}

export const imageExtension = new ImageExtension();
