import { LexicalEditor, $getSelection, $isRangeSelection } from "lexical";
import { BaseExtension } from "@lexkit/editor/extensions/base";
import { ExtensionCategory } from "@lexkit/editor/extensions/types";
import { BaseExtensionConfig } from "@lexkit/editor/extensions/types";
import { ReactNode } from "react";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { markdownExtension } from "../export/MarkdownExtension";
import {
  TableNode,
  TableRowNode,
  TableCellNode,
  $createTableNodeWithDimensions,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
} from "@lexical/table";
import {
  INSERT_TABLE_COMMAND,
  $isTableSelection,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
} from "@lexical/table";
import { $createParagraphNode, $createTextNode } from "lexical";
import {
  ContextMenuItem,
  ContextMenuProvider,
  ContextMenuRenderer,
  ContextMenuExtension,
  contextMenuExtension
} from "@lexkit/editor/extensions/core/ContextMenuExtension";

/**
 * Configuration options for the Table extension.
 */
export type TableConfig = BaseExtensionConfig & {
  rows?: number;
  columns?: number;
  includeHeaders?: boolean;
  /** Enable context menu on right-click */
  enableContextMenu?: boolean;
  /** Custom context menu items - can be static items or a function that receives commands */
  contextMenuItems?: ContextMenuItem[] | ((commands: TableCommands) => ContextMenuItem[]);
  /** Custom context menu renderer for complete headless control */
  contextMenuRenderer?: ContextMenuRenderer;
  /** Context menu extension instance to register providers with */
  contextMenuExtension?: typeof contextMenuExtension;
  /** Markdown extension instance to register transformers with */
  markdownExtension?: typeof markdownExtension;
};

/**
 * Commands provided by the Table extension.
 */
export type TableCommands = {
  insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => void;
  insertRowAbove: () => void;
  insertRowBelow: () => void;
  insertColumnLeft: () => void;
  insertColumnRight: () => void;
  deleteRow: () => void;
  deleteColumn: () => void;
  deleteTable: () => void;
  showTableContextMenu: (position: { x: number; y: number }) => void;
};

/**
 * State queries provided by the Table extension.
 */
export type TableStateQueries = {
  isTableSelected: () => Promise<boolean>;
  isInTableCell: () => Promise<boolean>;
};

/**
 * Table extension for handling table operations in the editor.
 * Provides commands for inserting and manipulating tables.
 */
export class TableExtension extends BaseExtension<
  "table",
  TableConfig,
  TableCommands,
  TableStateQueries,
  ReactNode[]
> {
  getContextMenuItems(commands: TableCommands): ContextMenuItem[] {
    if (typeof this.config.contextMenuItems === 'function') {
      return this.config.contextMenuItems(commands);
    }
    if (Array.isArray(this.config.contextMenuItems)) {
      return this.config.contextMenuItems;
    }
    return this.defaultContextMenuItems(commands);
  }

  private defaultContextMenuItems = (commands: TableCommands): ContextMenuItem[] => [
    {
      label: "Insert Row Above",
      action: () => commands.insertRowAbove(),
    },
    {
      label: "Insert Row Below",
      action: () => commands.insertRowBelow(),
    },
    {
      label: "Insert Column Left",
      action: () => commands.insertColumnLeft(),
    },
    {
      label: "Insert Column Right",
      action: () => commands.insertColumnRight(),
    },
    {
      label: "Delete Row",
      action: () => commands.deleteRow(),
    },
    {
      label: "Delete Column",
      action: () => commands.deleteColumn(),
    },
    {
      label: "Delete Table",
      action: () => commands.deleteTable(),
    },
  ];

  constructor(config?: Partial<TableConfig>) {
    super("table", [ExtensionCategory.Toolbar]);
    this.config = {
      rows: 3,
      columns: 3,
      includeHeaders: false,
      enableContextMenu: true,
      contextMenuItems: this.defaultContextMenuItems,
      ...config,
    };
  }

  configure(config: Partial<TableConfig>): this {
    this.config = { ...this.config, ...config };
    // Merge context menu items if provided
    if (config.contextMenuItems) {
      this.config.contextMenuItems = config.contextMenuItems;
    }
    return this;
  }

  register(editor: LexicalEditor): () => void {
    // Register its markdown transformer with markdown extension
    const mdExtension = this.config.markdownExtension || markdownExtension;
    try {
      mdExtension.registerTransformer?.(TABLE_MARKDOWN_TRANSFORMER as any);
    } catch (e) {
      console.warn('[TableExtension] failed to register table markdown transformer', e);
    }

    // Register our context menu provider if context menu is enabled
    if (this.config.enableContextMenu) {
      const contextMenuExt = this.config.contextMenuExtension || contextMenuExtension;

      if (contextMenuExt) {
        const provider: ContextMenuProvider = {
          id: 'table',
          priority: 10, // Higher priority for tables

          canHandle: ({ target, selection }) => {
            // Check if we're in a table cell
            const tableCell = target.closest('td, th, [data-lexical-table-cell]');
            if (!tableCell) return false;

            // Additional check via selection if needed
            if ($isTableSelection(selection)) return true;

            // Check via DOM
            return tableCell.tagName === 'TD' || tableCell.tagName === 'TH';
          },

          getItems: ({ editor }) => {
            const commands = this.getCommands(editor);
            return this.getContextMenuItems(commands);
          },

          renderer: this.config.contextMenuRenderer || contextMenuExt.config?.defaultRenderer,
        };

        const commands = contextMenuExt.getCommands(editor);
        commands.registerProvider(provider);

        return () => {
          const commands = contextMenuExt.getCommands(editor);
          if (commands) {
            commands.unregisterProvider('table');
          }
        };
      }
    }

    return () => {};
  }

  getNodes(): any[] {
    return [TableNode, TableRowNode, TableCellNode];
  }

  getCommands(editor: LexicalEditor): TableCommands {
    return {
      insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => {
        const { rows = 3, columns = 3, includeHeaders = false } = config;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const tableNode = $createTableNodeWithDimensions(rows, columns, includeHeaders);
            selection.insertNodes([tableNode]);
          }
        });
      },
      insertRowAbove: () => {
        editor.update(() => {
          $insertTableRowAtSelection(false); // false = insert above
        });
      },
      insertRowBelow: () => {
        editor.update(() => {
          $insertTableRowAtSelection(true); // true = insert below
        });
      },
      insertColumnLeft: () => {
        editor.update(() => {
          $insertTableColumnAtSelection(false); // false = insert left
        });
      },
      insertColumnRight: () => {
        editor.update(() => {
          $insertTableColumnAtSelection(true); // true = insert right
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
      },
      deleteTable: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isTableSelection(selection)) {
            selection.getNodes().forEach((node) => {
              if ($isTableNode(node)) {
                node.remove();
              }
            });
          }
        });
      },
      showTableContextMenu: (position: { x: number; y: number }) => {
        // This will be implemented when the extension system allows cross-extension commands
        // For now, this is a placeholder
      },
    };
  }

  getStateQueries(editor: LexicalEditor): TableStateQueries {
    return {
      isTableSelected: async () => {
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          return $isTableSelection(selection);
        });
      },
      isInTableCell: async () => {
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!selection || typeof selection !== 'object' || !('anchor' in selection) || !('focus' in selection)) return false;

          try {
            const anchorNode = (selection as any).anchor.getNode();
            const focusNode = (selection as any).focus.getNode();

            return $isTableCellNode(anchorNode) || $isTableCellNode(focusNode);
          } catch {
            return false;
          }
        });
      },
    };
  }

  getPlugins(): ReactNode[] {
    return [<TablePlugin key="table-plugin" />];
  }
}

/**
 * Pre-configured Table extension instance.
 * Ready to use in extension arrays.
 */
export const tableExtension = new TableExtension();

/**
 * Table Markdown Transformer
 * Supports standard GitHub Flavored Markdown table syntax.
 */
export const TABLE_MARKDOWN_TRANSFORMER = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: any) => {
    if (!$isTableNode(node)) {
      return null;
    }

    const rows = node.getChildren();
    if (rows.length === 0) return null;

    const tableData: string[][] = [];
    rows.forEach((row: any) => {
      if (!$isTableRowNode(row)) {
        return;
      }
      const cells = row.getChildren();
      const rowData: string[] = [];
      cells.forEach((cell: any) => {
        if (!$isTableCellNode(cell)) {
          return;
        }
        const textContent = cell.getTextContent().trim();
        rowData.push(textContent);
      });
      if (rowData.length > 0) tableData.push(rowData);
    });

    if (tableData.length === 0) return null;

    const markdownLines: string[] = [];
    if (tableData[0]) {
      markdownLines.push("| " + tableData[0].join(" | ") + " |");
    }

    const colCount = tableData[0]?.length || 1;
    const separator = "| " + Array(colCount).fill("---").join(" | ") + " |";
    markdownLines.push(separator);

    for (let i = 1; i < tableData.length; i++) {
      const row = tableData[i] || [];
      const paddedRow = [...row];
      while (paddedRow.length < colCount) paddedRow.push("");
      markdownLines.push("| " + paddedRow.join(" | ") + " |");
    }

    return markdownLines.join("\n");
  },
  regExpStart: /^\|.*\|$/,
  regExpEnd: {
    optional: true,
    regExp: /^$/
  },
  replace: (rootNode: any, children: any, startMatch: any, endMatch: any, linesInBetween: any, isImport: boolean) => {
    // Combine the start line with lines in between to get all table lines
    const allLines = [startMatch[0], ...(linesInBetween || [])];
    
    // Filter lines that look like table rows
    const tableLines = allLines.filter((line: string) => {
      const trimmed = line.trim();
      return trimmed && trimmed.includes('|') && trimmed.split('|').length > 1;
    });
    
    if (tableLines.length < 2) {
      return;
    }
    
    // Parse the table data
    const rows: string[][] = [];
    tableLines.forEach((line: string) => {
      const cells = line.split('|').slice(1, -1).map((cell: string) => cell.trim());
      if (cells.length > 0) {
        rows.push(cells);
      }
    });
    
    if (rows.length === 0 || !rows[0]) {
      return;
    }
    
    // Filter out separator rows (rows with only dashes and colons)
    const dataRows = rows.filter((row: string[]) => 
      !row.every((cell: string) => /^:?-+:?$/.test(cell))
    );
    
    if (dataRows.length === 0) {
      return;
    }
    
    const tableNode = $createTableNodeWithDimensions(dataRows.length, Math.max(...dataRows.map(r => r.length)), false);
    
    const tableRows = tableNode.getChildren();
    dataRows.forEach((rowData, rowIndex) => {
      const tableRow = tableRows[rowIndex];
      if ($isTableRowNode(tableRow)) {
        const cells = tableRow.getChildren();
        rowData.forEach((cellText, cellIndex) => {
          if (cellIndex < cells.length) {
            const cell = cells[cellIndex];
            if ($isTableCellNode(cell)) {
              cell.clear();
              const paragraph = $createParagraphNode();
              if (cellText) {
                paragraph.append($createTextNode(cellText));
              }
              cell.append(paragraph);
            }
          }
        });
      }
    });
    
    rootNode.append(tableNode);
  },
  type: "multiline-element" as const,
};
