import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_TABLE_COMMAND, TableNode, TableRowNode, TableCellNode, $isTableNode, $createTableNodeWithDimensions } from '@lexical/table';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import React from 'react';

/**
 * Table configuration type
 */
export type TableConfig = {
  rows: number;
  columns: number;
  includeHeaders?: boolean;
};

/**
 * Commands provided by the table extension.
 */
export type TableCommands = {
  insertTable: (config: TableConfig) => void;
};

/**
 * State queries provided by the table extension.
 */
export type TableStateQueries = {
  isTableSelected: () => Promise<boolean>;
};

/**
 * Table extension for inserting and managing tables.
 * Provides functionality to insert tables and manage table-related operations.
 *
 * @example
 * ```tsx
 * const extensions = [tableExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *   return (
 *     <button onClick={() => commands.insertTable(3, 3, true)}>
 *       Insert 3x3 Table with Headers
 *     </button>
 *   );
 * }
 * ```
 */
export class TableExtension extends BaseExtension<
  'table',
  any,
  TableCommands,
  TableStateQueries,
  React.ReactElement[]
> {
  /**
   * Creates a new table extension instance.
   */
  constructor() {
    super('table', [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the editor.
   * No special registration needed as Lexical handles table commands internally.
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
   * @returns Array containing the TableNode, TableRowNode, and TableCellNode
   */
  getNodes(): any[] {
    return [TableNode, TableRowNode, TableCellNode];
  }

  /**
   * Returns React plugins provided by this extension.
   *
   * @returns Array containing the TablePlugin
   */
  getPlugins(): React.ReactElement[] {
    return [<TablePlugin key="table" />];
  }

  /**
   * Returns commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with table command functions
   */
  getCommands(editor: LexicalEditor): TableCommands {
    return {
      insertTable: (config: TableConfig) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: config.columns.toString(),
          rows: config.rows.toString(),
          includeHeaders: config.includeHeaders ? { rows: true, columns: false } : false,
        });
      }
    };
  }

  /**
   * Returns state query functions provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with table state query functions
   */
  getStateQueries(editor: LexicalEditor): TableStateQueries {
    return {
      isTableSelected: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (selection && $isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              const hasTable = nodes.some((node: any) => $isTableNode(node));
              resolve(hasTable);
            } else {
              resolve(false);
            }
          });
        })
    };
  }
}

/**
 * Pre-configured table extension instance.
 * Ready to use in extension arrays.
 */
export const tableExtension = new TableExtension();

export default tableExtension;
