import React, { useState } from 'react';
import { LexicalEditor, DecoratorNode, NodeKey, $getSelection, $isRangeSelection, $getRoot, $createParagraphNode, DOMConversionMap, DOMConversionOutput, $getNodeByKey } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';

// Types
type HTMLEmbedPayload = {
  html: string;
  preview: boolean;
};

type HTMLEmbedCommands = {
  insertHTMLEmbed: (html?: string) => void;
  toggleHTMLPreview: () => void;
};

type HTMLEmbedQueries = {
  isHTMLEmbedSelected: () => Promise<boolean>;
  isHTMLPreviewMode: () => Promise<boolean>;
};

// Custom HTML Embed Node
export class HTMLEmbedNode extends DecoratorNode<ReactNode> {
  __payload: HTMLEmbedPayload;

  static getType(): string {
    return 'html-embed';
  }

  static clone(node: HTMLEmbedNode): HTMLEmbedNode {
    return new HTMLEmbedNode(node.__payload, node.__key);
  }

  constructor(payload: HTMLEmbedPayload, key?: NodeKey) {
    super(key);
    this.__payload = payload;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.setAttribute('data-lexical-html-embed', 'true');
    div.style.width = '100%';
    div.style.boxSizing = 'border-box';
    div.style.margin = '8px 0';
    return div;
  }

  updateDOM(): boolean {
    return false; // Let React handle updates
  }

  static importJSON(serializedNode: any): HTMLEmbedNode {
    const payload: HTMLEmbedPayload = {
      html: serializedNode.html || '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;"><h3>Custom HTML Block</h3><p>Edit this HTML to create your custom embed!</p></div>',
      preview: serializedNode.preview ?? true,
    };
    return new HTMLEmbedNode(payload);
  }

  exportJSON(): any {
    return {
      type: 'html-embed',
      html: this.__payload.html,
      preview: this.__payload.preview,
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      'div[data-lexical-html-embed]': () => ({
        conversion: (element: HTMLElement): DOMConversionOutput => {
          const html = element.getAttribute('data-html-content') || element.innerHTML || '';
          const payload: HTMLEmbedPayload = { html, preview: true };
          return { node: new HTMLEmbedNode(payload) };
        },
        priority: 4,
      }),
    };
  }

  exportDOM(): { element: HTMLElement } {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-html-embed', 'true');
    element.setAttribute('data-html-content', this.__payload.html);
    element.innerHTML = this.__payload.html; // Fallback for non-Lexical parsers
    return { element };
  }

  getPayload(): HTMLEmbedPayload {
    return this.getLatest().__payload;
  }

  setPayload(payload: HTMLEmbedPayload): void {
    const writable = this.getWritable();
    writable.__payload = payload;
  }

  decorate(editor: LexicalEditor): ReactNode {
    return <HTMLEmbedComponent nodeKey={this.__key} payload={this.__payload} editor={editor} />;
  }
}

// React Component for Rendering
const HTMLEmbedComponent: React.FC<{ nodeKey: NodeKey; payload: HTMLEmbedPayload; editor: LexicalEditor }> = ({ nodeKey, payload, editor }) => {
  const [html, setHtml] = useState(payload.html);

  const updatePayload = (newPayload: Partial<HTMLEmbedPayload>) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as HTMLEmbedNode;
      if (node) {
        node.setPayload({ ...node.getPayload(), ...newPayload });
      }
    });
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '8px',
        margin: '8px 0',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {payload.preview ? (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: payload.html }}
            style={{ minHeight: '40px' }}
          />
          <button
            onClick={() => updatePayload({ preview: false })}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              padding: '4px 8px',
              fontSize: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✏️ Edit
          </button>
        </>
      ) : (
        <>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            onBlur={() => updatePayload({ html })}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px',
              resize: 'vertical',
              background: '#fafafa',
            }}
            placeholder="Enter HTML here..."
            autoFocus
          />
          <button
            onClick={() => updatePayload({ html, preview: true })}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              padding: '4px 8px',
              fontSize: '10px',
              background: '#007ACC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            👁️ Preview
          </button>
        </>
      )}
    </div>
  );
};

// Extension
export class HTMLEmbedExtension extends BaseExtension<
  'htmlEmbed',
  {},
  HTMLEmbedCommands,
  HTMLEmbedQueries,
  ReactNode[]
> {
  constructor() {
    super('htmlEmbed', [ExtensionCategory.Toolbar]);
  }

  register(): () => void {
    return () => {};
  }

  getNodes(): any[] {
    return [HTMLEmbedNode];
  }

  getCommands(editor: LexicalEditor): HTMLEmbedCommands {
    return {
      insertHTMLEmbed: (html?: string) => {
        editor.update(() => {
          const payload: HTMLEmbedPayload = {
            html: html || '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;"><h3>Custom HTML Block</h3><p>Edit this HTML to create your custom embed!</p></div>',
            preview: false, // Start in edit mode
          };
          const node = new HTMLEmbedNode(payload);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([node]);
          } else {
            $getRoot().append($createParagraphNode().append(node));
          }
        });
      },
      toggleHTMLPreview: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            nodes.forEach((node) => {
              if (node instanceof HTMLEmbedNode) {
                const payload = node.getPayload();
                node.setPayload({ ...payload, preview: !payload.preview });
              }
            });
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): HTMLEmbedQueries {
    return {
      isHTMLEmbedSelected: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            resolve($isRangeSelection(selection) && selection.getNodes().some((node) => node instanceof HTMLEmbedNode));
          });
        }),
      isHTMLPreviewMode: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const node = selection.getNodes().find((node) => node instanceof HTMLEmbedNode);
              resolve(node ? (node as HTMLEmbedNode).getPayload().preview : false);
            } else {
              resolve(false);
            }
          });
        }),
    };
  }
}

// Markdown Transformer
export const HTML_EMBED_MARKDOWN_TRANSFORMER = {
  dependencies: [HTMLEmbedNode],
  export: (node: any) => {
    if (node instanceof HTMLEmbedNode) {
      return '```html\n' + node.getPayload().html + '\n```';
    }
    return null;
  },
  regExp: /^```html\n([\s\S]*?)\n```$/m,
  replace: (parentNode: any, _children: any[], match: RegExpMatchArray) => {
    const html = match[1] || '';
    const node = new HTMLEmbedNode({ html, preview: true });
    parentNode.replace(node);
  },
  type: 'element' as const,
};

export const htmlEmbedExtension = new HTMLEmbedExtension();
export type { HTMLEmbedCommands, HTMLEmbedQueries };
