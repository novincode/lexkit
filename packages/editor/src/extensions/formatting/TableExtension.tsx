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
        
        // Show context menu with table commands
        this.showTableContextMenu(editor, event.clientX, event.clientY, tableCell as HTMLElement);
      }
    };

    const handleSelectionChange = () => {
      // Check if we're in a table cell
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const focusNode = selection.focus.getNode();
          
          // Check if either anchor or focus is in a table cell
          const isInTable = this.isNodeInTableCell(anchorNode) || this.isNodeInTableCell(focusNode);
          
          if (isInTable) {
            this.showTableFloatingToolbar(editor);
          } else {
            this.hideTableFloatingToolbar(editor);
          }
        }
      });
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener('contextmenu', handleContextMenu);
      
      // Listen for selection changes
      const unregisterSelection = editor.registerUpdateListener(handleSelectionChange);
      
      return () => {
        editorElement.removeEventListener('contextmenu', handleContextMenu);
        unregisterSelection();
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

  /**
   * Helper method to check if a node is inside a table cell
   */
  private isNodeInTableCell(node: any): boolean {
    let currentNode = node;
    while (currentNode) {
      if ($isTableCellNode(currentNode)) {
        return true;
      }
      currentNode = currentNode.getParent();
    }
    return false;
  }

  /**
   * Shows context menu with table-specific commands
   */
  private showTableContextMenu(editor: LexicalEditor, x: number, y: number, target: HTMLElement) {
    // For now, we'll use a simple approach with direct DOM manipulation
    // In a real implementation, this would integrate with the context menu extension
    const contextMenu = document.createElement('div');
    contextMenu.className = 'table-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.background = 'white';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.borderRadius = '4px';
    contextMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    contextMenu.style.zIndex = '1000';
    contextMenu.style.minWidth = '150px';

    const items = [
      { label: 'Insert Row Above', action: () => this.insertRowAbove(editor) },
      { label: 'Insert Row Below', action: () => this.insertRowBelow(editor) },
      { label: 'Insert Column Left', action: () => this.insertColumnLeft(editor) },
      { label: 'Insert Column Right', action: () => this.insertColumnRight(editor) },
      { label: 'Delete Row', action: () => this.deleteRow(editor) },
      { label: 'Delete Column', action: () => this.deleteColumn(editor) },
    ];

    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.label;
      menuItem.style.padding = '8px 12px';
      menuItem.style.cursor = 'pointer';
      menuItem.style.borderBottom = '1px solid #eee';
      menuItem.addEventListener('click', () => {
        item.action();
        if (contextMenu.parentNode) {
          document.body.removeChild(contextMenu);
        }
        document.removeEventListener('click', closeMenu);
      });
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#f5f5f5';
      });
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'white';
      });
      contextMenu.appendChild(menuItem);
    });

    // Remove last border
    if (contextMenu.lastChild) {
      (contextMenu.lastChild as HTMLElement).style.borderBottom = 'none';
    }

    document.body.appendChild(contextMenu);

    // Close on click outside
    const closeMenu = (e: MouseEvent) => {
      if (!contextMenu.contains(e.target as Node) && contextMenu.parentNode) {
        document.body.removeChild(contextMenu);
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  /**
   * Shows floating toolbar with table commands
   */
  private showTableFloatingToolbar(editor: LexicalEditor) {
    // For now, we'll use a simple approach
    // In a real implementation, this would integrate with the floating toolbar extension
    console.log('Table floating toolbar would show here');
  }

  /**
   * Hides the table floating toolbar
   */
  private hideTableFloatingToolbar(editor: LexicalEditor) {
    // For now, we'll use a simple approach
    console.log('Table floating toolbar would hide here');
  }

  /**
   * Inserts a row above the current selection
   */
  private insertRowAbove(editor: LexicalEditor) {
    editor.update(() => {
      $insertTableRowAtSelection(false);
    });
  }

  /**
   * Inserts a row below the current selection
   */
  private insertRowBelow(editor: LexicalEditor) {
    editor.update(() => {
      $insertTableRowAtSelection(true);
    });
  }

  /**
   * Inserts a column to the left of the current selection
   */
  private insertColumnLeft(editor: LexicalEditor) {
    editor.update(() => {
      $insertTableColumnAtSelection(false);
    });
  }

  /**
   * Inserts a column to the right of the current selection
   */
  private insertColumnRight(editor: LexicalEditor) {
    editor.update(() => {
      $insertTableColumnAtSelection(true);
    });
  }

  /**
   * Deletes the current row
   */
  private deleteRow(editor: LexicalEditor) {
    editor.update(() => {
      $deleteTableRowAtSelection();
    });
  }

  /**
   * Deletes the current column
   */
  private deleteColumn(editor: LexicalEditor) {
    editor.update(() => {
      $deleteTableColumnAtSelection();
    });
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

          // Get text content from cell more safely
          let textContent = '';
          try {
            textContent = cell.getTextContent().trim();
          } catch (error) {
            console.warn('Error getting cell text content:', error);
            textContent = '';
          }
          rowData.push(textContent || ' ');
        }

        if (rowData.length > 0) {
          tableData.push(rowData);
        }
      }

      if (tableData.length === 0) return null;

      // Generate markdown with better formatting
      const markdownLines: string[] = [];

      // First row (header)
      if (tableData[0]) {
        markdownLines.push('| ' + tableData[0].join(' | ') + ' |');
      }

      // Separator row
      const colCount = tableData[0]?.length || 1;
      const separator = '| ' + Array(colCount).fill('---').join(' | ') + ' |';
      markdownLines.push(separator);

      // Data rows (skip first row since it's the header)
      for (let i = 1; i < tableData.length; i++) {
        const row = tableData[i];
        if (row && row.length > 0) {
          // Pad row to match column count
          const paddedRow = [...row];
          while (paddedRow.length < colCount) {
            paddedRow.push(' ');
          }
          markdownLines.push('| ' + paddedRow.join(' | ') + ' |');
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
      console.log('🔧 TABLE_MARKDOWN_TRANSFORMER replace called with match:', match[0]);
      
      const fullMatch = match[0];
      const lines = fullMatch.trim().split('\n');

      if (lines.length < 2) {
        console.log('❌ Not enough lines for table');
        return;
      }

      // Parse all rows
      const tableData: string[][] = [];

      for (const line of lines) {
        if (!line.trim()) continue;

        const cells = line.split('|').slice(1, -1).map((cell: string) => cell.trim());

        // Skip separator line (contains only dashes, colons, spaces)
        if (cells.every((cell: string) => /^[\s\-:]+$/.test(cell))) {
          continue;
        }

        if (cells.length > 0) {
          tableData.push(cells);
        }
      }

      if (tableData.length === 0) {
        console.log('❌ No table data found');
        return;
      }

      console.log('✅ Parsed table data:', tableData);

      const totalRows = tableData.length;
      const totalCols = Math.max(...tableData.map(row => row.length));

      // Create table node with proper dimensions
      const tableNode = $createTableNodeWithDimensions(totalRows, totalCols, true);
      
      // Fill table with data safely
      const tableRows = tableNode.getChildren();

      tableData.forEach((rowData, rowIndex) => {
        const tableRow = tableRows[rowIndex];
        if (tableRow && $isTableRowNode(tableRow)) {
          const rowCells = tableRow.getChildren();

          rowData.forEach((cellText, colIndex) => {
            const cell = rowCells[colIndex];
            if (cell && $isTableCellNode(cell)) {
              // Clear existing content safely
              const children = cell.getChildren();
              children.forEach(child => child.remove());

              // Add new content
              if (cellText && cellText.trim()) {
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(cellText.trim()));
                cell.append(paragraph);
              } else {
                // Always add a paragraph, even if empty
                const paragraph = $createParagraphNode();
                cell.append(paragraph);
              }
            }
          });
        }
      });

      // For multiline-element transformers, we need to replace the parent node directly
      parentNode.replace(tableNode);
      console.log('✅ Table node replaced successfully');
    } catch (error) {
      console.error('❌ Error importing table from markdown:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      // Don't replace if there's an error to prevent state corruption
    }
  },
  type: 'element' as const, // Changed from 'multiline-element' to 'element'
};

/**
 * Pre-configured table extension instance.
 * Ready to use in extension arrays.
 */
export const tableExtension = new TableExtension();

export default tableExtension;
