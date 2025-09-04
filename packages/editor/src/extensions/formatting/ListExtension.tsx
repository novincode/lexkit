import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ListNode, ListItemNode, $isListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import React from 'react';

// Define types for inference
export type ListCommands = {
  toggleUnorderedList: () => void;
  toggleOrderedList: () => void;
};

export class ListExtension extends BaseExtension<
  'list',
  any,
  ListCommands,
  { unorderedList: () => Promise<boolean>; orderedList: () => Promise<boolean> },
  ReactNode[]
> {
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

  getCommands(editor: LexicalEditor): ListCommands {
    return {
      toggleUnorderedList: () => {
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
      toggleOrderedList: () => {
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

  getStateQueries(editor: LexicalEditor): { unorderedList: () => Promise<boolean>; orderedList: () => Promise<boolean> } {
    return {
      unorderedList: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              resolve(false);
              return;
            }
            let node: any = selection.anchor.getNode();
            while (node) {
              if ($isListNode(node)) {
                resolve(node.getListType() === 'bullet');
                return;
              }
              node = node.getParent();
            }
            resolve(false);
          });
        }),
      orderedList: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              resolve(false);
              return;
            }
            let node: any = selection.anchor.getNode();
            while (node) {
              if ($isListNode(node)) {
                resolve(node.getListType() === 'number');
                return;
              }
              node = node.getParent();
            }
            resolve(false);
          });
        }),
    };
  }
}

export const listExtension = new ListExtension();
