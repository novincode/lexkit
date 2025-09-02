import { FORMAT_TEXT_COMMAND } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { useEditor } from '../../../core/useEditor';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';

export class BoldExtension extends BaseExtension {
  constructor() {
    super('bold', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally, no need to register
    return () => {};
  }

  getThemeContribution(): Record<string, string> {
    return this.config.nodeClassName ? { 'text.bold': this.config.nodeClassName } : {};
  }
}

export const boldExtension = new BoldExtension();