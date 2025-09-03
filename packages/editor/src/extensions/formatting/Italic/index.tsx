import { FORMAT_TEXT_COMMAND } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';

export class ItalicExtension extends BaseExtension<'italic'> {
  constructor() {
    super('italic', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally
    return () => {};
  }

  getCommands(editor: LexicalEditor) {
    return {
      toggleItalic: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      },
    };
  }
}

export const italicExtension = new ItalicExtension();
