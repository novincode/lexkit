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

/**
 * Configuration options for the Table extension.
 */
export type TableConfig = BaseExtensionConfig & {
  rows?: number;
  columns?: number;
  includeHeaders?: boolean;
};

/**
 * Commands provided by the Table extension.
 */
export type TableCommands = {
  insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => void;
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
  constructor() {
    super("table", [ExtensionCategory.Toolbar]);
  }

  configure(config: Partial<TableConfig>): this {
    this.config = { ...this.config, ...config };
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
        console.log('[TableExtension] insertTable called with config:', config);
        const { rows = 3, columns = 3, includeHeaders = false } = config;

        editor.update(() => {
          const selection = $getSelection();
          console.log('[TableExtension] Current selection:', selection);
          if ($isRangeSelection(selection)) {
            const tableNode = $createTableNodeWithDimensions(rows, columns, includeHeaders);
            console.log('[TableExtension] Created table node:', tableNode);
            selection.insertNodes([tableNode]);
            console.log('[TableExtension] Inserted table node');
          } else {
            console.log('[TableExtension] No range selection, cannot insert table');
          }
        });
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
    console.log('[TableTransformer] Export called for node type:', node?.getType?.(), 'node:', node);
    console.log('[TableTransformer] Is table node?', $isTableNode(node));
    if (!$isTableNode(node)) {
      console.log('[TableTransformer] Not a table node, returning null');
      return null;
    }

    const rows = node.getChildren();
    console.log('[TableTransformer] Table has', rows.length, 'rows');
    if (rows.length === 0) return null;

    const tableData: string[][] = [];
    rows.forEach((row: any, rowIndex: number) => {
      console.log('[TableTransformer] Processing row', rowIndex, 'type:', row?.getType?.());
      if (!$isTableRowNode(row)) {
        console.log('[TableTransformer] Row is not a table row node');
        return;
      }
      const cells = row.getChildren();
      console.log('[TableTransformer] Row has', cells.length, 'cells');
      const rowData: string[] = [];
      cells.forEach((cell: any, cellIndex: number) => {
        console.log('[TableTransformer] Processing cell', cellIndex, 'type:', cell?.getType?.());
        if (!$isTableCellNode(cell)) {
          console.log('[TableTransformer] Cell is not a table cell node');
          return;
        }
        const textContent = cell.getTextContent().trim();
        console.log('[TableTransformer] Cell text content:', textContent);
        rowData.push(textContent);
      });
      if (rowData.length > 0) tableData.push(rowData);
    });

    console.log('[TableTransformer] Final table data:', tableData);
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

    const result = markdownLines.join("\n");
    console.log('[TableTransformer] Export result:', result);
    return result;
  },
  regExpStart: /^\|.*\|$/,
  regExpEnd: {
    optional: true,
    regExp: /^$/
  },
  replace: (rootNode: any, children: any, startMatch: any, endMatch: any, linesInBetween: any, isImport: boolean) => {
    console.log('[TableTransformer] Multiline replace called');
    console.log('[TableTransformer] startMatch:', startMatch);
    console.log('[TableTransformer] linesInBetween:', linesInBetween);
    console.log('[TableTransformer] isImport:', isImport);
    
    // Combine the start line with lines in between to get all table lines
    const allLines = [startMatch[0], ...(linesInBetween || [])];
    console.log('[TableTransformer] All table lines:', allLines);
    
    // Filter lines that look like table rows
    const tableLines = allLines.filter((line: string) => {
      const trimmed = line.trim();
      return trimmed && trimmed.includes('|') && trimmed.split('|').length > 1;
    });
    
    console.log('[TableTransformer] Filtered table lines:', tableLines);
    
    if (tableLines.length < 2) {
      console.log('[TableTransformer] Not enough table lines, skipping');
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
    
    console.log('[TableTransformer] Parsed rows:', rows);
    
    if (rows.length === 0 || !rows[0]) {
      console.log('[TableTransformer] No valid rows, skipping');
      return;
    }
    
    // Filter out separator rows (rows with only dashes and colons)
    const dataRows = rows.filter((row: string[]) => 
      !row.every((cell: string) => /^:?-+:?$/.test(cell))
    );
    
    console.log('[TableTransformer] Data rows after filtering separators:', dataRows);
    
    if (dataRows.length === 0) {
      console.log('[TableTransformer] No data rows after filtering, skipping');
      return;
    }
    
    const tableNode = $createTableNodeWithDimensions(dataRows.length, Math.max(...dataRows.map(r => r.length)), false);
    console.log('[TableTransformer] Created table node with', dataRows.length, 'rows and', Math.max(...dataRows.map(r => r.length)), 'columns');
    
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
    
    console.log('[TableTransformer] Replacing rootNode with tableNode');
    rootNode.append(tableNode);
    console.log('[TableTransformer] Replacement complete');
  },
  type: "multiline-element" as const,
};
