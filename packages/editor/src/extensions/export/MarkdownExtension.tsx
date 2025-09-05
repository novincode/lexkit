import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { BaseExtensionConfig } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, $createParagraphNode } from 'lexical';

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
    this.config = {};
  }

  configure(config: Partial<MarkdownConfig & BaseExtensionConfig>): this {
    console.log('🔧 Configuring MarkdownExtension with transformers:', config.customTransformers);
    this.config = { ...this.config, ...config };
    return this;
  }

  register(editor: LexicalEditor): () => void {
    return () => {
      // Cleanup if needed
    };
  }

  getCommands(editor: LexicalEditor): MarkdownCommands {
    // Append custom transformers to ensure they take precedence
    const transformers = [...TRANSFORMERS, ...(this.config.customTransformers || [])];

    return {
      exportToMarkdown: () => {
        return editor.getEditorState().read(() => {
          try {
            console.log('🔄 Starting markdown export with transformers:', transformers.length);
            
            // First, try the standard Lexical export
            let markdown = $convertToMarkdownString(transformers);
            console.log('� Standard Lexical markdown result:', markdown);
            
            // Now manually handle HTML embed nodes (since Lexical might not traverse DecoratorNodes)
            const root = $getRoot();
            const allChildren = root.getChildren();
            console.log('� Checking all children for HTML embeds...');
            
            // Find our custom transformer
            const htmlEmbedTransformer = transformers.find(t => 
              t.dependencies && 
              t.dependencies.some((d: any) => d.getType && d.getType() === 'html-embed')
            );
            
            if (htmlEmbedTransformer) {
              console.log('✅ Found HTML embed transformer');
              
              allChildren.forEach((node, index) => {
                console.log(`🔍 Checking node ${index}:`, node.getType(), node.constructor.name);
                
                if (node.getType() === 'html-embed') {
                  console.log('🎯 Found HTML embed node, calling transformer...');
                  try {
                    const transformerResult = htmlEmbedTransformer.export(node, null, null);
                    console.log('🔄 Transformer result:', transformerResult);
                    
                    if (transformerResult) {
                      // Add the transformer result to our markdown
                      if (markdown.trim()) {
                        markdown += '\n\n' + transformerResult;
                      } else {
                        markdown = transformerResult;
                      }
                      console.log('✅ Added HTML embed to markdown');
                    }
                  } catch (error) {
                    console.error('❌ Error calling transformer:', error);
                  }
                }
              });
            } else {
              console.log('❌ HTML embed transformer not found!');
            }
            
            console.log('✅ Final markdown result:', markdown);
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

            console.log('🔄 Importing Markdown with transformers:', transformers.length, 'content:', markdown);
            $convertFromMarkdownString(markdown, transformers);
            console.log('✅ Markdown import completed');
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
