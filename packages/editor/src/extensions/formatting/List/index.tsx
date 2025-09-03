import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { ComponentType, CSSProperties } from 'react';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '../../BaseExtension';
import { ExtensionCategory } from '@repo/editor/extensions';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import React from 'react';

export class ListExtension extends BaseExtension<'list'> {
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

  getPlugins(): React.ReactNode[] {
    return [<ListPlugin key="list-plugin" />];
  }

  getCommands(editor: LexicalEditor) {
    return {
      toggleUnorderedList: async () => {
        const { INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } = await import('@lexical/list');
        const { $getSelection, $isRangeSelection } = await import('lexical');
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            let parent = anchorNode.getParent();
            let hasList = false;
            while (parent) {
              if (parent.getType() === 'list') {
                hasList = true;
                break;
              }
              parent = parent.getParent();
            }
            if (hasList) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }
          }
        });
      },
      toggleOrderedList: async () => {
        const { INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } = await import('@lexical/list');
        const { $getSelection, $isRangeSelection } = await import('lexical');
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            let parent = anchorNode.getParent();
            let hasList = false;
            while (parent) {
              if (parent.getType() === 'list') {
                hasList = true;
                break;
              }
              parent = parent.getParent();
            }
            if (hasList) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
          }
        });
      },
    };
  }
}

export const listExtension = new ListExtension();
