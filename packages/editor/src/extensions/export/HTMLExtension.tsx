import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

export type HTMLCommands = {
  exportToHTML: () => string;
  importFromHTML: (html: string) => void;
};

export type HTMLStateQueries = {
  canExportHTML: () => Promise<boolean>;
};

export class HTMLExtension extends BaseExtension<
  'html',
  {},
  HTMLCommands,
  HTMLStateQueries,
  ReactNode[]
> {
  constructor() {
    super('html', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

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
            // Clear existing content properly
            const root = editor.getRootElement();
            if (root) {
              // Clear all children
              while (root.firstChild) {
                root.removeChild(root.firstChild);
              }
            }

            // Parse and insert HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nodes = $generateNodesFromDOM(editor, doc);

            // Insert nodes
            if (nodes && nodes.length > 0) {
              const rootNode = editor.getRootElement();
              if (rootNode) {
                nodes.forEach((node: any) => {
                  if (node) {
                    rootNode.appendChild(node);
                  }
                });
              }
            }
          } catch (error) {
            console.error('Error importing HTML:', error);
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): HTMLStateQueries {
    return {
      canExportHTML: async () => true,
    };
  }
}

export const htmlExtension = new HTMLExtension();
