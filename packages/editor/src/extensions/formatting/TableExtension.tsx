import {
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $isNodeSelection,
} from "lexical";
import {
  INSERT_TABLE_COMMAND,
  TableNode,
  TableRowNode,
  TableCellNode,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  $createTableNodeWithDimensions,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
} from "@lexical/table";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { BaseExtension } from "@lexkit/editor/extensions/base";
import { ExtensionCategory, BaseExtensionConfig } from "@lexkit/editor/extensions/types";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useBaseEditor as useEditor } from "../../core/createEditorSystem";
import type { LexicalNode } from "lexical";

/**
 * Table configuration type
 */
export type TableConfig = BaseExtensionConfig & {
  rows: number;
  columns: number;
  includeHeaders?: boolean;
  contextMenuRenderer?: (params: {
    position: { x: number; y: number };
    commands: TableCommands['table'];
    onClose: () => void;
  }) => React.ReactElement;
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
 * const extensions = [
 *   tableExtension.configure({
 *     contextMenuRenderer: ({ position, commands, onClose }) => (
 *       <div style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 1000 }}>
 *         <button onClick={() => { commands.insertRowAbove(); onClose(); }}>Insert Row Above</button>
 *       </div>
 *     ),
 *   })
 * ] as const;
 * const { Provider, useEditor } = createEditorSystem(extensions);
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *   return <button onClick={() => commands.insertTable({ rows: 3, columns: 3, includeHeaders: true })}>Insert 3x3 Table with Headers</button>;
 * }
 */
export class TableExtension extends BaseExtension<
  "table",
  TableConfig,
  TableCommands,
  TableStateQueries,
  React.ReactElement[]
> {
  /**
   * Creates a new table extension instance.
   */
  constructor() {
    super("table", [ExtensionCategory.Toolbar]);
    this.config = { rows: 3, columns: 3, includeHeaders: false };
  }

  /**
   * Configures the table extension with custom settings.
   */
  configure(config: Partial<TableConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Registers the extension with the editor.
   * No special registration needed beyond plugins.
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
   * @returns Array containing the TablePlugin and TableContextMenuPlugin
   */
  getPlugins(): React.ReactElement[] {
    return [
      <TablePlugin key="table" />,
      <TableContextMenuPlugin key="table-context-menu" extension={this} />,
    ];
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
          includeHeaders: !!config.includeHeaders,
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
        },
      },
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
        }),
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
 * Plugin for rendering table context menu
 */
function TableContextMenuPlugin({ extension }: { extension: TableExtension }) {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const handleContextMenu = (event: MouseEvent) => {
      const targetEl = event.target as HTMLElement;
      const tableCell = targetEl.closest("td, th");
      if (tableCell) {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setTarget(tableCell as HTMLElement);
        setIsOpen(true);
      }
    };

    editorElement.addEventListener("contextmenu", handleContextMenu);

    return () => {
      editorElement.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [editor]);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (target && !target.contains(e.target as Node)) {
          setIsOpen(false);
          setTarget(null);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, target]);

  if (!isOpen) return null;

  const tableCommands = extension.getCommands(editor).table;

  const renderer = extension.config.contextMenuRenderer;

  if (!renderer) {
    // Default renderer
    return createPortal(
      <div
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          minWidth: "150px",
        }}
      >
        {[
          { label: "Insert Row Above", action: tableCommands.insertRowAbove },
          { label: "Insert Row Below", action: tableCommands.insertRowBelow },
          { label: "Insert Column Left", action: tableCommands.insertColumnLeft },
          { label: "Insert Column Right", action: tableCommands.insertColumnRight },
          { label: "Delete Row", action: tableCommands.deleteRow },
          { label: "Delete Column", action: tableCommands.deleteColumn },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => {
              item.action();
              setIsOpen(false);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {item.label}
          </div>
        ))}
      </div>,
      document.body
    );
  }

  // Custom renderer
  return createPortal(
    renderer({
      position,
      commands: tableCommands,
      onClose: () => setIsOpen(false),
    }),
    document.body
  );
}

/**
 * Table Markdown Transformer
 * Supports standard GitHub Flavored Markdown table syntax.
 * Updated regex to properly match full table blocks, including empty cells.
 */
export const TABLE_MARKDOWN_TRANSFORMER = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: any) => {
    console.log("🔄 TABLE_MARKDOWN_TRANSFORMER export called with node:", node);
    if (!$isTableNode(node)) {
      console.log("❌ Node is not a table node");
      return null;
    }

    console.log("🎯 Exporting table node");
    try {
      const rows = node.getChildren();
      console.log("📊 Table has", rows.length, "rows");
      if (rows.length === 0) return null;

      const tableData: string[][] = [];

      // Extract data from each row
      for (const row of rows) {
        if (!$isTableRowNode(row)) continue;

        const cells = row.getChildren();
        const rowData: string[] = [];

        for (const cell of cells) {
          if (!$isTableCellNode(cell)) continue;

          let textContent = "";
          try {
            textContent = cell.getTextContent().trim();
            console.log("📝 Cell text content:", textContent);
          } catch (error) {
            console.warn("Error getting cell text content:", error);
            textContent = "";
          }
          rowData.push(textContent);
        }

        if (rowData.length > 0) {
          tableData.push(rowData);
        }
      }

      console.log("📋 Table data extracted:", tableData);
      if (tableData.length === 0) return null;

      // Generate markdown
      const markdownLines: string[] = [];

      // Header row
      if (tableData[0]) {
        markdownLines.push("| " + tableData[0].join(" | ") + " |");
      }

      // Separator
      const colCount = tableData[0]?.length || 1;
      const separator = "| " + Array(colCount).fill("---").join(" | ") + " |";
      markdownLines.push(separator);

      // Data rows
      for (let i = 1; i < tableData.length; i++) {
        const row = tableData[i];
        if (!row) continue;
        const paddedRow = [...row];
        while (paddedRow.length < colCount) {
          paddedRow.push("");
        }
        markdownLines.push("| " + paddedRow.join(" | ") + " |");
      }

      const result = markdownLines.join("\n");
      console.log("🎯 Generated markdown:", result);
      return result;
    } catch (error) {
      console.error("Error exporting table to markdown:", error);
      return null;
    }
  },
  regExp: /^\|.+\|$/,
  replace: (parentNode: any, children: any[], match: RegExpMatchArray) => {
    // This transformer is now handled in MarkdownExtension
    // This is just a placeholder to prevent other transformers from interfering
    console.log("🔄 TABLE_MARKDOWN_TRANSFORMER replace placeholder called");
    return;
  },
  type: "element" as const,
};

/**
 * Pre-configured table extension instance.
 * Ready to use in extension arrays.
 */
export const tableExtension = new TableExtension();

export default tableExtension;
