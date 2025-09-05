import { LexicalEditor, $getSelection, $isRangeSelection, $createParagraphNode, $createTextNode, $isNodeSelection } from 'lexical';
import { 
  INSERT_TABLE_COMMAND, 
  TableNode, 
  TableRowNode, 
  TableCellNode, 
  $isTableNode, 
  $isTableRowNode,
  $isTableCellNode,
  $createTableNodeWithDimensions,
  $createTableRowNode,
  $createTableCellNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection
} from '@lexical/table';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import React from 'react';
import type { LexicalNode, ElementNode } from 'lexical';

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
  table: {
    insertRowAbove: () => void;
    insertRowBelow: () => void;
    insertColumnLeft: () => void;
    insertColumnRight: () => void;
    deleteRow: () => void;
    deleteColumn: () => void;
  };
};

/**
 * State queries provided by the table extension.
 */
export type TableStateQueries = {
  isTableSelected: () => Promise<boolean>;
  isInTableCell: () => Promise<boolean>;
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
   * Sets up context menu handlers for table interactions.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if we're right-clicking on a table element
      const tableCell = target.closest('td, th');
      if (tableCell) {
        event.preventDefault();
        
        // Get the context menu extension if available
        // This would need to be accessed through the editor system
        // For now, we'll add this as a comment for the implementation
        
        /*
        const contextMenuConfig = {
          items: [
            { label: 'Insert Row Above', action: () => this.insertRowAbove(editor) },
            { label: 'Insert Row Below', action: () => this.insertRowBelow(editor) },
            { separator: true },
            { label: 'Insert Column Left', action: () => this.insertColumnLeft(editor) },
            { label: 'Insert Column Right', action: () => this.insertColumnRight(editor) },
            { separator: true },
            { label: 'Delete Row', action: () => this.deleteRow(editor) },
            { label: 'Delete Column', action: () => this.deleteColumn(editor) },
          ],
          position: { x: event.clientX, y: event.clientY },
          target: tableCell
        };
        
        // commands.showContextMenu(contextMenuConfig);
        */
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener('contextmenu', handleContextMenu);
      return () => {
        editorElement.removeEventListener('contextmenu', handleContextMenu);
      };
    }

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
      },
      table: {
        insertRowAbove: () => {
          editor.update(() => {
            $insertTableRowAtSelection(false);
          });
        },
        insertRowBelow: () => {
          editor.update(() => {
            $insertTableRowAtSelection(true);
          });
        },
        insertColumnLeft: () => {
          editor.update(() => {
            $insertTableColumnAtSelection(false);
          });
        },
        insertColumnRight: () => {
          editor.update(() => {
            $insertTableColumnAtSelection(true);
          });
        },
        deleteRow: () => {
          editor.update(() => {
            $deleteTableRowAtSelection();
          });
        },
        deleteColumn: () => {
          editor.update(() => {
            $deleteTableColumnAtSelection();
          });
        }
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
            if (selection) {
              if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                
                // Check if any selected node or its ancestors is a table
                for (const node of nodes) {
                  let currentNode: any = node;
                  while (currentNode) {
                    if ($isTableNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              } else if ($isNodeSelection(selection)) {
                // Handle node selection
                const nodes = selection.getNodes();
                for (const node of nodes) {
                  let currentNode: any = node;
                  while (currentNode) {
                    if ($isTableNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              } else {
                // For other selection types, check if we're in a table by traversing up the DOM
                const nodes = selection.getNodes();
                if (nodes.length > 0) {
                  let currentNode: any = nodes[0];
                  while (currentNode) {
                    if ($isTableNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              }
            } else {
              resolve(false);
            }
          });
        }),
      isInTableCell: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (selection) {
              if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                
                // Check if any selected node or its ancestors is a table cell
                for (const node of nodes) {
                  let currentNode: any = node;
                  while (currentNode) {
                    if ($isTableCellNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              } else if ($isNodeSelection(selection)) {
                // Handle node selection
                const nodes = selection.getNodes();
                for (const node of nodes) {
                  let currentNode: any = node;
                  while (currentNode) {
                    if ($isTableCellNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              } else {
                // For other selection types, check if we're in a table cell by traversing up the DOM
                const nodes = selection.getNodes();
                if (nodes.length > 0) {
                  let currentNode: any = nodes[0];
                  while (currentNode) {
                    if ($isTableCellNode(currentNode)) {
                      resolve(true);
                      return;
                    }
                    currentNode = currentNode.getParent();
                  }
                }
                resolve(false);
              }
            } else {
              resolve(false);
            }
          });
        })
    };
  }

  /**
   * Returns markdown transformers provided by this extension.
   *
   * @returns Array containing table markdown transformers
   */
  getMarkdownTransformers(): any[] {
    return [TABLE_MARKDOWN_TRANSFORMER];
  }
}

/**
 * Table Markdown Transformer
 * Supports standard GitHub Flavored Markdown table syntax
 */
export const TABLE_MARKDOWN_TRANSFORMER = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: any) => {
    if (!$isTableNode(node)) return null;

    try {
      const rows = node.getChildren();
      if (rows.length === 0) return null;

      const tableData: string[][] = [];

      // Extract data from each row
      for (const row of rows) {
        if (!$isTableRowNode(row)) continue;

        const cells = row.getChildren();
        const rowData: string[] = [];

        for (const cell of cells) {
          if (!$isTableCellNode(cell)) continue;

          // Get text content from cell
          const textContent = cell.getTextContent().trim();
          rowData.push(textContent || ' ');
        }

        if (rowData.length > 0) {
          tableData.push(rowData);
        }
      }

      if (tableData.length === 0 || !tableData[0]) return null;

      // Generate markdown
      const markdownLines: string[] = [];

      // Header row
      markdownLines.push('| ' + tableData[0].join(' | ') + ' |');

      // Separator row
      const colCount = tableData[0].length;
      const separator = '| ' + Array(colCount).fill('---').join(' | ') + ' |';
      markdownLines.push(separator);

      // Data rows
      for (let i = 1; i < tableData.length; i++) {
        const row = tableData[i];
        if (row) {
          markdownLines.push('| ' + row.join(' | ') + ' |');
        }
      }

      return markdownLines.join('\n');
    } catch (error) {
      console.error('Error exporting table to markdown:', error);
      return null;
    }
  },
  regExp: /^\|(.+)\|\s*\n\|[\s\-\|:]+\|\s*\n(?:\|(.+)\|\s*\n)*$/,
  replace: (parentNode: any, _children: any[], match: any) => {
    try {
      const fullMatch = match[0];
      const lines = fullMatch.trim().split('\n');

      if (lines.length < 2) return;

      // Parse all rows
      const tableData: string[][] = [];
      let isHeader = true;

      for (const line of lines) {
        if (!line.trim()) continue;

        const cells = line.split('|').slice(1, -1).map((cell: string) => cell.trim());

        // Skip separator line (contains only dashes)
        if (cells.every((cell: string) => /^-+$/.test(cell))) {
          isHeader = false;
          continue;
        }

        tableData.push(cells);
      }

      if (tableData.length === 0) return;

      const totalRows = tableData.length;
      const totalCols = Math.max(...tableData.map(row => row.length));

      // Create table
      const tableNode = $createTableNodeWithDimensions(totalRows, totalCols, true);
      const tableRows = tableNode.getChildren();

      // Fill table with data
      tableData.forEach((rowData, rowIndex) => {
        if (tableRows[rowIndex] && $isTableRowNode(tableRows[rowIndex])) {
          const rowCells = tableRows[rowIndex].getChildren();

          rowData.forEach((cellText, colIndex) => {
            if (rowCells[colIndex] && $isTableCellNode(rowCells[colIndex])) {
              const cell = rowCells[colIndex] as any;
              cell.clear();

              const paragraph = $createParagraphNode();
              if (cellText && cellText.trim()) {
                paragraph.append($createTextNode(cellText.trim()));
              }
              cell.append(paragraph);
            }
          });
        }
      });

      parentNode.replace(tableNode);
    } catch (error) {
      console.error('Error importing table from markdown:', error);
    }
  },
  type: 'multiline-element' as const,
};

/**
 * Pre-configured table extension instance.
 * Ready to use in extension arrays.
 */
export const tableExtension = new TableExtension();

export default tableExtension;
