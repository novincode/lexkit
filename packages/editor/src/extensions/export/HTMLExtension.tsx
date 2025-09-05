import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';

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

  getStateQueries(editor: LexicalEditor): HTMLStateQueries {
    return {
      canExportHTML: async () => true,
    };
  }
}

export const htmlExtension = new HTMLExtension();
