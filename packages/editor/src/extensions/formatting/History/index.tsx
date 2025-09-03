import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '../../types';
import { ReactNode } from 'react';

export type HistoryCommands = {};

export class HistoryExtension extends BaseExtension<'history', any, HistoryCommands, ReactNode[]> {
  constructor() {
    super('history', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // No registration needed for history
    return () => {};
  }

  getPlugins(): ReactNode[] {
    // Lazy load in useEffect in createEditorSystem
    return [];
  }
}

export const historyExtension = new HistoryExtension();
