import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode } from 'lexical';

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
            // Clear existing content
            const root = $getRoot();
            root.clear();

            if (html.trim()) {
              // Parse and insert HTML
              const parser = new DOMParser();
              const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
              const nodes = $generateNodesFromDOM(editor, doc);

              // Insert nodes
              if (nodes && nodes.length > 0) {
                nodes.forEach((node: any) => {
                  if (node) {
                    root.append(node);
                  }
                });
              }
            } else {
              // If empty HTML, add a default paragraph
              const paragraph = $createParagraphNode();
              root.append(paragraph);
            }
          } catch (error) {
            console.error('Error importing HTML:', error);
            // Fallback: clear and add empty paragraph
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          }
        }, { discrete: true });
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
