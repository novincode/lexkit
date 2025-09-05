import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { ReactNode } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';

/**
 * Commands provided by the HTML extension.
 */
export type HTMLCommands = {
  /** Export the current editor content as HTML string */
  exportToHTML: () => string;
  /** Import HTML content into the editor, replacing current content */
  importFromHTML: (html: string) => void;
};

/**
 * State queries provided by the HTML extension.
 */
export type HTMLStateQueries = {
  /** Check if HTML export is available (always true) */
  canExportHTML: () => Promise<boolean>;
};

/**
 * HTML extension for importing and exporting HTML content.
 * Provides functionality to convert between Lexical editor state and HTML strings.
 *
 * @example
 * ```tsx
 * const extensions = [htmlExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *
 *   const handleExport = () => {
 *     const html = commands.exportToHTML();
 *     console.log('Exported HTML:', html);
 *   };
 *
 *   const handleImport = () => {
 *     const html = '<p>Hello <strong>world</strong>!</p>';
 *     commands.importFromHTML(html);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleExport}>Export HTML</button>
 *       <button onClick={handleImport}>Import HTML</button>
 *     </div>
 *   );
 * }
 * ```
 */
export class HTMLExtension extends BaseExtension<
  'html',
  {},
  HTMLCommands,
  HTMLStateQueries,
  ReactNode[]
> {
  /**
   * Creates a new HTML extension instance.
   */
  constructor() {
    super('html', [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the Lexical editor.
   * No special registration needed for HTML functionality.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

  /**
   * Returns the commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing HTML import/export commands
   */
  getCommands(editor: LexicalEditor): HTMLCommands {
    return {
      exportToHTML: () => {
        return editor.getEditorState().read(() => {
          return $generateHtmlFromNodes(editor);
        });
      },

      importFromHTML: (html: string) => {
        editor.update(() => {
          try {
            const root = $getRoot();
            root.clear();

            if (html.trim()) {
              // Parse HTML properly to avoid wrapper issues
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              
              // Generate nodes from the body to avoid extra wrappers
              const nodes = $generateNodesFromDOM(editor, doc);
              
              // Insert nodes directly to root
              if (nodes && nodes.length > 0) {
                nodes.forEach((node: any) => {
                  if (node) {
                    root.append(node);
                  }
                });
              } else {
                root.append($createParagraphNode());
              }
            } else {
              root.append($createParagraphNode());
            }
          } catch (error) {
            console.error('Error importing HTML:', error);
            const root = $getRoot();
            root.clear();
            root.append($createParagraphNode());
          }
        }, { discrete: true });
      },
    };
  }

  /**
   * Returns state query functions for this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing state query functions
   */
  getStateQueries(editor: LexicalEditor): HTMLStateQueries {
    return {
      canExportHTML: async () => true,
    };
  }
}

/**
 * Pre-configured HTML extension instance.
 * Ready to use in extension arrays.
 */
export const htmlExtension = new HTMLExtension();
