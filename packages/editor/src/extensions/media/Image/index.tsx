import { DecoratorNode } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

export interface ImagePayload { src: string; alt: string; caption?: string; }

export interface SerializedImageNode {
  type: 'image';
  version: number;
  src: string;
  alt: string;
  caption?: string;
}

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __alt: string;
  __caption?: string;

  static getType() { return 'image'; }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__caption, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.alt, serializedNode.caption);
  }

  constructor(src: string, alt: string, caption?: string, key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
    };
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

export class ImageExtension extends BaseExtension {
  constructor() {
    super('image', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Register commands if needed
    return () => {};
  }

  getNodes(): any[] {
    return [ImageNode];
  }

  getThemeContribution(): Record<string, string> {
    return this.config.nodeClassName ? { 'image': this.config.nodeClassName } : {};
  }
}

export const imageExtension = new ImageExtension();
