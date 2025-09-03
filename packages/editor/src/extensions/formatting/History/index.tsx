import { UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';
import { ReactNode } from 'react';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

export type HistoryCommands = {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
};

export class HistoryExtension extends BaseExtension<'history', any, HistoryCommands, ReactNode[]> {
  constructor() {
    super('history', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // No registration needed for history
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [<HistoryPlugin key="history-plugin" />];
  }

  getCommands(editor: LexicalEditor): HistoryCommands {
    return {
      undo: () => {
        editor.focus();
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      },
      redo: () => {
        editor.focus();
        editor.dispatchCommand(REDO_COMMAND, undefined);
      },
      clearHistory: () => editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
    };
  }

  getStateQueries?(editor: LexicalEditor): Record<string, () => Promise<boolean>>;
}

export const historyExtension = new HistoryExtension();
