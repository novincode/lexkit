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
} from "@lexical/table";
import { $createParagraphNode, $createTextNode } from "lexical";
import { ContextMenuItem } from "@lexkit/editor/extensions/core/ContextMenuExtension";

/**
 * Configuration options for the Table extension.
 */
export type TableConfig = BaseExtensionConfig & {
  rows?: number;
  columns?: number;
  includeHeaders?: boolean;
  /** Custom context menu items for tables */
  contextMenuItems?: ContextMenuItem[];
  /** Whether to show context menu on right-click */
  enableContextMenu?: boolean;
};

/**
 * Commands provided by the Table extension.
 */
export type TableCommands = {
  insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => void;
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
  private defaultContextMenuItems: ContextMenuItem[] = [
    {
      label: "Insert Row Above",
      action: () => {
        // TODO: Implement insert row above
        console.log("Insert row above");
      },
    },
    {
      label: "Insert Row Below",
      action: () => {
        // TODO: Implement insert row below
        console.log("Insert row below");
      },
    },
    {
      label: "Insert Column Left",
      action: () => {
        // TODO: Implement insert column left
        console.log("Insert column left");
      },
    },
    {
      label: "Insert Column Right",
      action: () => {
        // TODO: Implement insert column right
        console.log("Insert column right");
      },
    },
    {
      label: "Delete Row",
      action: () => {
        // TODO: Implement delete row
        console.log("Delete row");
      },
    },
    {
      label: "Delete Column",
      action: () => {
        // TODO: Implement delete column
        console.log("Delete column");
      },
    },
    {
      label: "Delete Table",
      action: () => {
        // TODO: Implement delete table
        console.log("Delete table");
      },
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
    try {
      markdownExtension.registerTransformer?.(TABLE_MARKDOWN_TRANSFORMER as any);
    } catch (e) {
      console.warn('[TableExtension] failed to register table markdown transformer', e);
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
