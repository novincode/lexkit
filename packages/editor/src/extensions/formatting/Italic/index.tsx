import { FORMAT_TEXT_COMMAND } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

export class ItalicExtension extends BaseExtension {
  constructor() {
    super('italic', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally
    return () => {};
  }

  getThemeContribution(): Record<string, string> {
    return this.config.nodeClassName ? { 'text.italic': this.config.nodeClassName } : {};
  }
}

export const italicExtension = new ItalicExtension();
