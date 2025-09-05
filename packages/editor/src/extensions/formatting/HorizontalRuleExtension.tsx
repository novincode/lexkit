import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_HORIZONTAL_RULE_COMMAND, $isHorizontalRuleNode, HorizontalRuleNode, $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import React from 'react';

/**
 * Commands provided by the horizontal rule extension.
 */
export type HorizontalRuleCommands = {
  insertHorizontalRule: () => void;
};

/**
 * State queries provided by the horizontal rule extension.
 */
export type HorizontalRuleStateQueries = {
  isHorizontalRuleSelected: () => Promise<boolean>;
};

/**
 * Horizontal rule extension for inserting horizontal lines/dividers.
 * Provides functionality to insert and manage horizontal rules in the editor.
 *
 * @example
 * ```tsx
 * const extensions = [horizontalRuleExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *   return (
 *     <button onClick={() => commands.insertHorizontalRule()}>
 *       Insert HR
 *     </button>
 *   );
 * }
 * ```
 */
export class HorizontalRuleExtension extends BaseExtension<
  'horizontalRule',
  any,
  HorizontalRuleCommands,
  HorizontalRuleStateQueries,
  React.ReactElement[]
> {
  /**
   * Creates a new horizontal rule extension instance.
   */
  constructor() {
    super('horizontalRule', [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the editor.
   * No special registration needed as Lexical handles HR commands internally.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Returns the Lexical nodes provided by this extension.
   *
   * @returns Array containing the HorizontalRuleNode
   */
  getNodes(): any[] {
    return [HorizontalRuleNode];
  }

  /**
   * Returns React plugins provided by this extension.
   *
   * @returns Array containing the HorizontalRulePlugin
   */
  getPlugins(): React.ReactElement[] {
    return [<HorizontalRulePlugin key="horizontal-rule" />];
  }

  /**
   * Returns commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with horizontal rule command functions
   */
  getCommands(editor: LexicalEditor): HorizontalRuleCommands {
    return {
      insertHorizontalRule: () => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
      }
    };
  }

  /**
   * Returns state query functions provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with horizontal rule state query functions
   */
  getStateQueries(editor: LexicalEditor): HorizontalRuleStateQueries {
    return {
      isHorizontalRuleSelected: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (selection && $isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              const hasHorizontalRule = nodes.some((node: any) => $isHorizontalRuleNode(node));
              resolve(hasHorizontalRule);
            } else {
              resolve(false);
            }
          });
        })
    };
  }
}

/**
 * Pre-configured horizontal rule extension instance.
 * Ready to use in extension arrays.
 */
export const horizontalRuleExtension = new HorizontalRuleExtension();

export default horizontalRuleExtension;
