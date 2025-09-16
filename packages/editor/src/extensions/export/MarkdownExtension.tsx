import { LexicalEditor } from "lexical";
import { BaseExtension } from "@lexkit/editor/extensions/base";
import { ExtensionCategory } from "@lexkit/editor/extensions/types";
import { BaseExtensionConfig } from "@lexkit/editor/extensions/types";
import { ReactNode } from "react";
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { HTMLEmbedNode } from "../media/HTMLEmbedExtension";
import {
  $createTableNodeWithDimensions,
  $isTableRowNode,
  $isTableCellNode,
} from "@lexical/table";

/**
 * Configuration options for the Markdown extension.
 */
export type MarkdownConfig = {
  /** Custom transformers to extend Markdown parsing */
  customTransformers?: Array<any>;
};

/**
 * Commands provided by the Markdown extension.
 */
export type MarkdownCommands = {
  /** Export the current editor content as Markdown string */
  exportToMarkdown: () => string;
  /** Import Markdown content into the editor, replacing current content */
  importFromMarkdown: (markdown: string, immediate?: boolean) => void;
};

/**
 * State queries provided by the Markdown extension.
 */
export type MarkdownStateQueries = {
  /** Check if Markdown export is available (always true) */
  canExportMarkdown: () => Promise<boolean>;
};

/**
 * Markdown extension for importing and exporting Markdown content.
 * Provides functionality to convert between Lexical editor state and Markdown strings,
 * with support for custom transformers and HTML embed blocks.
 *
 * @example
 * ```tsx
 * const extensions = [
 *   markdownExtension.configure({
 *     customTransformers: [customTransformer]
 *   })
 * ] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *
 *   const handleExport = () => {
 *     const markdown = commands.exportToMarkdown();
 *     console.log('Exported Markdown:', markdown);
 *   };
 *
 *   const handleImport = () => {
 *     const markdown = '# Hello World\n\nThis is **bold** text.';
 *     commands.importFromMarkdown(markdown);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleExport}>Export Markdown</button>
 *       <button onClick={handleImport}>Import Markdown</button>
 *     </div>
 *   );
 * }
 * ```
 */
export class MarkdownExtension extends BaseExtension<
  "markdown",
  MarkdownConfig & BaseExtensionConfig,
  MarkdownCommands,
  MarkdownStateQueries,
  ReactNode[]
> {
  private debounceTimeout: NodeJS.Timeout | null = null;

  /**
   * Creates a new Markdown extension instance.
   */
  constructor() {
    super("markdown", [ExtensionCategory.Toolbar]);
    this.config = { customTransformers: [] };
  }

  /**
   * Configures the Markdown extension with custom settings.
   *
   * @param config - Configuration options
   * @returns This extension instance for chaining
   */
  configure(config: Partial<MarkdownConfig & BaseExtensionConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Registers the extension with the Lexical editor.
   * No special registration needed for Markdown functionality.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Returns the commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing Markdown import/export commands
   */
  getCommands(editor: LexicalEditor): MarkdownCommands {
    const transformers = [
      ...(this.config.customTransformers || []),
      ...TRANSFORMERS,
    ];

    console.log("🔧 MarkdownExtension transformers:", transformers.length, transformers.map(t => t.type || 'unknown'));

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            console.log("📤 Exporting to markdown with transformers:", transformers.length);
            const result = $convertToMarkdownString(transformers);
            console.log("📤 Export result:", result);
            return result;
          } catch (error) {
            console.error("❌ Markdown export error:", error);
            return "";
          }
        });
      },

      importFromMarkdown: (markdown: string, immediate = false) => {
        // Clear existing debounce
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }

        const performImport = () => {
          editor.update(
            () => {
              try {
                const transformers = [
                  ...(this.config.customTransformers || []),
                  ...TRANSFORMERS,
                ];

                const root = $getRoot();
                root.clear();

                if (!markdown.trim()) {
                  root.append($createParagraphNode());
                  return;
                }

                // Pre-process html-embed blocks
                let processedMarkdown = markdown;
                const htmlEmbedBlocks: { html: string; placeholder: string }[] =
                  [];

                processedMarkdown = processedMarkdown.replace(
                  /```html-embed\s*\n([\s\S]*?)\n```/g,
                  (match, htmlContent) => {
                    const placeholder = `HTMLEMBEDPLACEHOLDER${htmlEmbedBlocks.length}HTMLEMBEDPLACEHOLDER`;
                    htmlEmbedBlocks.push({
                      html: htmlContent.trim(),
                      placeholder,
                    });
                    return placeholder;
                  },
                );

                // Pre-process table blocks
                const tableBlocks: { tableData: string; placeholder: string }[] = [];
                processedMarkdown = processedMarkdown.replace(
                  /(\|.+?\|\s*\n\|[\s\-:|]+\|(?:\s*\n\|.+?\|)*)/g,
                  (match, tableContent) => {
                    const placeholder = `TABLEPLACEHOLDER${tableBlocks.length}TABLEPLACEHOLDER`;
                    tableBlocks.push({
                      tableData: tableContent.trim(),
                      placeholder,
                    });
                    return placeholder;
                  },
                );

                $convertFromMarkdownString(processedMarkdown, transformers);

                // Replace placeholders with HTML embed nodes
                if (htmlEmbedBlocks.length > 0) {
                  const traverseAndReplace = (node: any) => {
                    if (node.getTextContent?.()) {
                      const text = node.getTextContent();
                      for (const { html, placeholder } of htmlEmbedBlocks) {
                        if (text === placeholder) {
                          const payload = { html, preview: true };
                          const embedNode = new HTMLEmbedNode(payload);
                          if (node !== root && node.getParent?.()) {
                            node.replace(embedNode);
                            return;
                          }
                        }
                      }
                    }

                    if (node.getChildren?.()) {
                      [...node.getChildren()].forEach((child) =>
                        traverseAndReplace(child),
                      );
                    }
                  };

                  traverseAndReplace(root);
                }

                // Replace placeholders with table nodes
                if (tableBlocks.length > 0) {
                  const traverseAndReplaceTable = (node: any) => {
                    if (node.getTextContent?.()) {
                      const text = node.getTextContent();
                      for (const { tableData, placeholder } of tableBlocks) {
                        if (text === placeholder) {
                          console.log("🔄 Converting table placeholder to table node");
                          console.log("📝 Table data:", tableData);
                          
                          // Parse table data
                          const lines = tableData.split('\n').filter(line => line.trim() && line.includes('|'));
                          const tableRows: string[][] = [];
                          
                          for (const line of lines) {
                            const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
                            // Skip separator rows (contains only dashes, colons, spaces)
                            if (!cells.every(cell => /^[\s\-:]+$/.test(cell))) {
                              tableRows.push(cells);
                            }
                          }
                          
                          if (tableRows.length > 0) {
                            const maxCols = Math.max(...tableRows.map(row => row.length));
                            const tableNode = $createTableNodeWithDimensions(tableRows.length, maxCols, true);
                            
                            const tableNodeRows = tableNode.getChildren();
                            tableRows.forEach((rowData, rowIndex) => {
                              const tableRow = tableNodeRows[rowIndex];
                              if (tableRow && $isTableRowNode(tableRow)) {
                                const rowCells = tableRow.getChildren();
                                
                                for (let colIndex = 0; colIndex < maxCols; colIndex++) {
                                  const cell = rowCells[colIndex];
                                  const cellText = rowData[colIndex] || "";
                                  
                                  if (cell && $isTableCellNode(cell)) {
                                    cell.getChildren().forEach((child: any) => child.remove());
                                    const paragraph = $createParagraphNode();
                                    if (cellText.trim()) {
                                      paragraph.append($createTextNode(cellText.trim()));
                                    }
                                    cell.append(paragraph);
                                  }
                                }
                              }
                            });
                            
                            if (node !== root && node.getParent?.()) {
                              node.replace(tableNode);
                              return;
                            }
                          }
                        }
                      }
                    }

                    if (node.getChildren?.()) {
                      [...node.getChildren()].forEach(child => traverseAndReplaceTable(child));
                    }
                  };

                  traverseAndReplaceTable(root);
                }
              } catch (error) {
                console.error("❌ Markdown import error:", error);
                const root = $getRoot();
                root.clear();
                root.append($createParagraphNode());
              }
            },
            { discrete: true },
          );
        };

        if (immediate) {
          performImport();
        } else {
          this.debounceTimeout = setTimeout(performImport, 500);
        }
      },
    };
  }

  /**
   * Returns state query functions for this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing state query functions
   */
  getStateQueries(editor: LexicalEditor): MarkdownStateQueries {
    return {
      canExportMarkdown: async () => true,
    };
  }
}

/**
 * Pre-configured Markdown extension instance.
 * Ready to use in extension arrays.
 */
export const markdownExtension = new MarkdownExtension();
