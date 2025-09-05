import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';

export type HTMLCommands = {
  exportToHTML: () => Promise<string>;
  importFromHTML: (html: string) => Promise<void>;
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
  private htmlPlugin: any = null;

  constructor() {
    super('html', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Lazy load HTML plugin
    import('@lexical/html').then(({ $generateHtmlFromNodes, $generateNodesFromDOM }) => {
      this.htmlPlugin = { $generateHtmlFromNodes, $generateNodesFromDOM };
    });

    return () => {
      // Cleanup if needed
    };
  }

  getCommands(editor: LexicalEditor): HTMLCommands {
    return {
      exportToHTML: async () => {
        if (!this.htmlPlugin) {
          throw new Error('HTML plugin not loaded');
        }

        return new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const html = this.htmlPlugin.$generateHtmlFromNodes(editor);
            resolve(html);
          });
        });
      },

      importFromHTML: async (html: string) => {
        if (!this.htmlPlugin) {
          throw new Error('HTML plugin not loaded');
        }

        editor.update(() => {
          // Clear existing content
          const root = editor.getRootElement();
          if (root) {
            root.innerHTML = '';
          }

          // Parse and insert HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const nodes = this.htmlPlugin.$generateNodesFromDOM(editor, doc.body);

          // Insert nodes
          nodes.forEach((node: any) => {
            editor.getRootElement()?.appendChild(node);
          });
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): HTMLStateQueries {
    return {
      canExportHTML: async () => {
        return this.htmlPlugin !== null;
      },
    };
  }
}

export const htmlExtension = new HTMLExtension();
