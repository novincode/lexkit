import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { ListNode, ListItemNode, $isListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import React from 'react';

/**
 * Commands provided by the list extension.
 */
export type ListCommands = {
  /** Toggle unordered (bullet) list for the current selection */
  toggleUnorderedList: () => void;
  /** Toggle ordered (numbered) list for the current selection */
  toggleOrderedList: () => void;
};

/**
 * List extension for creating and managing ordered and unordered lists.
 * Provides functionality to convert paragraphs to lists and vice versa.
 *
 * @example
 * ```tsx
 * const extensions = [listExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands, activeStates } = useEditor();
 *   return (
 *     <div>
 *       <button
 *         onClick={() => commands.toggleUnorderedList()}
 *         className={activeStates.unorderedList ? 'active' : ''}
 *       >
 *         Bullet List
 *       </button>
 *       <button
 *         onClick={() => commands.toggleOrderedList()}
 *         className={activeStates.orderedList ? 'active' : ''}
 *       >
 *         Numbered List
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export class ListExtension extends BaseExtension<
  'list',
  any,
  ListCommands,
  { unorderedList: () => Promise<boolean>; orderedList: () => Promise<boolean> },
  ReactNode[]
> {
  /**
   * Creates a new list extension instance.
   */
  constructor() {
    super('list', [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the Lexical editor.
   * No special registration needed as Lexical handles list commands internally.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function (no-op for lists)
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Returns the Lexical nodes required for list functionality.
   *
   * @returns Array containing ListNode and ListItemNode
   */
  getNodes(): any[] {
    return [ListNode, ListItemNode];
  }

  /**
   * Returns the React plugins required for list functionality.
   *
   * @returns Array containing the ListPlugin component
   */
  getPlugins(): React.ReactNode[] {
    return [<ListPlugin key="list-plugin" />];
  }

  /**
   * Returns the commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing list toggle commands
   */
  getCommands(editor: LexicalEditor): ListCommands {
    return {
      toggleUnorderedList: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            let parent = anchorNode.getParent();
            let listNode: any = null;
            while (parent) {
              if ($isListNode(parent)) {
                listNode = parent;
                break;
              }
              parent = parent.getParent();
            }

            if (listNode) {
              // If already an unordered list, remove it
              if (listNode.getListType() === 'bullet') {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
              } else {
                // If it's an ordered list, convert to unordered
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
              }
            } else {
              // No list, create unordered list
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
            let listNode: any = null;
            while (parent) {
              if ($isListNode(parent)) {
                listNode = parent;
                break;
              }
              parent = parent.getParent();
            }

            if (listNode) {
              // If already an ordered list, remove it
              if (listNode.getListType() === 'number') {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
              } else {
                // If it's an unordered list, convert to ordered
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
              }
            } else {
              // No list, create ordered list
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
          }
        });
      },
    };
  }

  /**
   * Returns state query functions to check current list state.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing state query functions for list types
   */
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

/**
 * Pre-configured list extension instance.
 * Ready to use in extension arrays.
 */
export const listExtension = new ListExtension();
