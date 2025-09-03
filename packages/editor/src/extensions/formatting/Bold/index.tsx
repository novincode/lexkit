import { FORMAT_TEXT_COMMAND } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';

export class BoldExtension extends BaseExtension<'bold'> {
  constructor() {
    super('bold', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lexical handles FORMAT_TEXT_COMMAND internally, no need to register
    return () => {};
  }

  getCommands(editor: LexicalEditor) {
    return {
      toggleBold: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      },
    };
  }
}

export const boldExtension = new BoldExtension();