import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { ComponentType, CSSProperties } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';
import { ListNode, ListItemNode } from '@lexical/list';

export class ListExtension extends BaseExtension {
  constructor() {
    super('list', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // No need to register commands, Lexical handles them
    return () => {};
  }

  getNodes(): any[] {
    return [ListNode, ListItemNode];
  }
}

export const listExtension = new ListExtension();
