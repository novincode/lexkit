import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';

export type ItalicCommands = {
  toggleItalic: () => void;
};

export class ItalicExtension extends BaseExtension<'italic', any, ItalicCommands, ReactNode[]> {
  supportedFormats: readonly TextFormatType[] = ['italic'];

  constructor() {
    super('italic', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally
    return () => {};
  }

  getCommands(editor: LexicalEditor): ItalicCommands {
    return {
      toggleItalic: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      },
    };
  }
}

export const italicExtension = new ItalicExtension();
