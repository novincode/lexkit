import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { BaseExtensionConfig } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, $createParagraphNode } from 'lexical';
import { HTMLEmbedNode } from '../media/HTMLEmbedExtension';

export type MarkdownConfig = {
  customTransformers?: Array<any>;
};

export type MarkdownCommands = {
  exportToMarkdown: () => string;
  importFromMarkdown: (markdown: string) => void;
};

export type MarkdownStateQueries = {
  canExportMarkdown: () => Promise<boolean>;
};

export class MarkdownExtension extends BaseExtension<
  'markdown',
  MarkdownConfig & BaseExtensionConfig,
  MarkdownCommands,
  MarkdownStateQueries,
  ReactNode[]
> {
  constructor() {
    super('markdown', [ExtensionCategory.Toolbar]);
    this.config = { customTransformers: [] };
  }

  configure(config: Partial<MarkdownConfig & BaseExtensionConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

  getCommands(editor: LexicalEditor): MarkdownCommands {
    // Put custom transformers BEFORE default ones to give them priority
    const transformers = [...(this.config.customTransformers || []), ...TRANSFORMERS];

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            // Use Lexical's built-in markdown conversion with all transformers
            const markdown = $convertToMarkdownString(transformers);
            return markdown;
          } catch (error) {
            console.error('❌ Markdown export error:', error);
            return '';
          }
        });
      },

      importFromMarkdown: (markdown: string) => {
        editor.update(() => {
          try {
            const root = $getRoot();
            root.clear();

            if (!markdown.trim()) {
              root.append($createParagraphNode());
              return;
            }

            // Pre-process markdown to handle our custom html-embed blocks
            let processedMarkdown = markdown;
            const htmlEmbedBlocks: { html: string; placeholder: string }[] = [];
            
            // Find and extract html-embed blocks, replace with safe placeholders that won't be processed by markdown
            processedMarkdown = processedMarkdown.replace(/```html-embed\s*\n([\s\S]*?)\n```/g, (match, htmlContent) => {
              const placeholder = `HTMLEMBEDPLACEHOLDER${htmlEmbedBlocks.length}HTMLEMBEDPLACEHOLDER`;
              htmlEmbedBlocks.push({ html: htmlContent.trim(), placeholder });
              return placeholder;
            });

            // Convert the processed markdown with standard transformers
            $convertFromMarkdownString(processedMarkdown, transformers);

            // Replace placeholders with actual HTML embed nodes
            if (htmlEmbedBlocks.length > 0) {
              const root = $getRoot();
              
              const traverseAndReplace = (node: any) => {
                if (node.getTextContent && typeof node.getTextContent === 'function') {
                  const text = node.getTextContent();
                  
                  for (const { html, placeholder } of htmlEmbedBlocks) {
                    if (text === placeholder) {
                      const payload = { html, preview: true };
                      const embedNode = new HTMLEmbedNode(payload);
                      
                      // Only replace if it's not the root node
                      if (node !== root && node.getParent && node.getParent()) {
                        node.replace(embedNode);
                        return;
                      }
                    }
                  }
                }
                
                // Recursively check children
                if (node.getChildren && typeof node.getChildren === 'function') {
                  const children = [...node.getChildren()]; // Create a copy to avoid mutation issues
                  children.forEach(child => traverseAndReplace(child));
                }
              };
              
              traverseAndReplace(root);
            }
          } catch (error) {
            console.error('❌ Markdown import error:', error);
            const root = $getRoot();
            root.clear();
            root.append($createParagraphNode());
          }
        }, { discrete: true });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): MarkdownStateQueries {
    return {
      canExportMarkdown: async () => true,
    };
  }
}

export const markdownExtension = new MarkdownExtension();
