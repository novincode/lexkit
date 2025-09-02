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
}

export const italicExtension = new ItalicExtension();
