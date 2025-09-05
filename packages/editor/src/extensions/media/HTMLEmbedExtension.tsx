// HTMLEmbedExtension.tsx
// Clean, scalable, headless HTML embed extension that works across all tabs

import React, { useState } from 'react';
import { 
  LexicalEditor, 
  DecoratorNode, 
  NodeKey, 
  $getSelection, 
  $isRangeSelection, 
  $getRoot, 
  $getNodeByKey,
  DOMConversionMap,
  DOMConversionOutput,
  SerializedLexicalNode,
  Spread
} from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';

// Types
export type HTMLEmbedPayload = {
  html: string;
  preview: boolean;
};

export type HTMLEmbedCommands = {
  insertHTMLEmbed: (html?: string) => void;
  toggleHTMLPreview: () => void;
};

export type HTMLEmbedQueries = {
  isHTMLEmbedSelected: () => Promise<boolean>;
  isHTMLPreviewMode: () => Promise<boolean>;
};

type SerializedHTMLEmbedNode = Spread<
  {
    html: string;
    preview: boolean;
    type: 'html-embed';
    version: 1;
  },
  SerializedLexicalNode
>;

// HTML Embed Node - Using DecoratorNode for React-based rendering
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

  // DOM creation for Lexical
  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.setAttribute('data-lexical-html-embed', 'true');
    div.className = 'html-embed-container';
    return div;
  }

  updateDOM(): boolean {
    return false; // Let React handle all updates
  }

  // Serialization for editor state persistence
  static importJSON(serialized: SerializedHTMLEmbedNode): HTMLEmbedNode {
    const payload: HTMLEmbedPayload = {
      html: serialized.html || '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;"><h3>Custom HTML Block</h3><p>Edit this HTML to create your custom embed!</p></div>',
      preview: serialized.preview ?? true,
    };
    return new HTMLEmbedNode(payload);
  }

  exportJSON(): SerializedHTMLEmbedNode {
    return {
      type: 'html-embed',
      html: this.__payload.html,
      preview: this.__payload.preview,
      version: 1,
    };
  }

  // HTML import/export for HTML tab
  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-html-embed')) {
          return null;
        }
        return {
          conversion: (element: HTMLElement): DOMConversionOutput => {
            const html = element.getAttribute('data-html-content') || element.innerHTML || '';
            const payload: HTMLEmbedPayload = { html, preview: true };
            return { node: new HTMLEmbedNode(payload) };
          },
          priority: 4,
        };
      },
    };
  }

  exportDOM(): { element: HTMLElement } {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-html-embed', 'true');
    element.setAttribute('data-html-content', this.__payload.html);
    // Don't set innerHTML to avoid duplication - the data-html-content is sufficient
    return { element };
  }

  // Public API for payload management
  getPayload(): HTMLEmbedPayload {
    return this.getLatest().__payload;
  }

  setPayload(payload: Partial<HTMLEmbedPayload>): void {
    const writable = this.getWritable();
    writable.__payload = { ...writable.__payload, ...payload };
  }

  // React component rendering
  decorate(editor: LexicalEditor): ReactNode {
    return (
      <HTMLEmbedComponent 
        nodeKey={this.__key} 
        payload={this.__payload} 
        editor={editor} 
      />
    );
  }

  // Lexical node configuration
  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

// React Component - Clean and headless design
const HTMLEmbedComponent: React.FC<{ 
  nodeKey: NodeKey; 
  payload: HTMLEmbedPayload; 
  editor: LexicalEditor 
}> = ({ nodeKey, payload, editor }) => {
  const [localHtml, setLocalHtml] = useState(payload.html);
  const [isSelected, setIsSelected] = useState(false);

  // Update payload in Lexical state
  const updatePayload = (newPayload: Partial<HTMLEmbedPayload>) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as HTMLEmbedNode;
      if (node) {
        node.setPayload(newPayload);
      }
    });
  };

  // Handle HTML content changes
  const handleHtmlChange = (html: string) => {
    setLocalHtml(html);
  };

  const handleHtmlBlur = () => {
    if (localHtml !== payload.html) {
      updatePayload({ html: localHtml });
    }
  };

  const togglePreview = () => {
    updatePayload({ preview: !payload.preview });
  };

  // Clean, accessible UI
  return (
    <div className="html-embed-wrapper">
      {payload.preview ? (
        <div className="html-embed-preview">
          <div 
            className="html-embed-content"
            dangerouslySetInnerHTML={{ __html: payload.html }}
          />
          <button 
            className="html-embed-toggle"
            onClick={togglePreview}
            title="Edit HTML"
            type="button"
          >
            ✏️ Edit
          </button>
        </div>
      ) : (
        <div className="html-embed-editor">
          <textarea
            className="html-embed-textarea"
            value={localHtml}
            onChange={(e) => handleHtmlChange(e.target.value)}
            onBlur={handleHtmlBlur}
            placeholder="Enter HTML here..."
            autoFocus
          />
          <button 
            className="html-embed-toggle"
            onClick={() => {
              handleHtmlBlur(); // Save changes first
              togglePreview();
            }}
            title="Preview HTML"
            type="button"
          >
            👁️ Preview
          </button>
        </div>
      )}
    </div>
  );
};

// Extension class
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

  register(editor: LexicalEditor): () => void {
    // No additional registration needed for DecoratorNode
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
            $getRoot().append(node);
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
                node.setPayload({ preview: !payload.preview });
              }
            });
          }
        });
      },
    };
  }

  getStateQueries(editor: LexicalEditor): HTMLEmbedQueries {
    return {
      isHTMLEmbedSelected: () => new Promise((resolve) => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const hasHTMLEmbed = selection.getNodes().some(node => node instanceof HTMLEmbedNode);
            resolve(hasHTMLEmbed);
          } else {
            resolve(false);
          }
        });
      }),

      isHTMLPreviewMode: () => new Promise((resolve) => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const embedNode = selection.getNodes().find(node => node instanceof HTMLEmbedNode) as HTMLEmbedNode;
            resolve(embedNode ? embedNode.getPayload().preview : false);
          } else {
            resolve(false);
          }
        });
      }),
    };
  }
}

// Markdown Transformer - Properly implemented for Lexical 0.34
export const HTML_EMBED_MARKDOWN_TRANSFORMER = {
  dependencies: [HTMLEmbedNode],
  export: (node: any) => {
    console.log('🔍 Transformer export called for node:', node?.getType?.());
    
    // Check if this is our HTML embed node
    if (node && typeof node.getType === 'function' && node.getType() === 'html-embed') {
      console.log('✅ Exporting HTML embed node');
      try {
        const payload = node.getPayload();
        const result = '```html-embed\n' + payload.html + '\n```';
        console.log('🔄 HTML embed markdown result:', result);
        return result;
      } catch (error) {
        console.error('❌ Error exporting HTML embed:', error);
        return null;
      }
    }
    
    return null;
  },
  regExp: /^```html-embed\n([\s\S]*?)\n```$/,
  replace: (parentNode: any, _children: any[], match: RegExpMatchArray) => {
    console.log('🔄 Importing HTML embed from markdown, match:', match[1]);
    const html = match[1] || '';
    
    try {
      const payload: HTMLEmbedPayload = { html, preview: true };
      const node = new HTMLEmbedNode(payload);
      parentNode.replace(node);
      console.log('✅ HTML embed node created and replaced');
    } catch (error) {
      console.error('❌ Error creating HTML embed node:', error);
    }
  },
  type: 'element' as const,
};

// Export instances
export const htmlEmbedExtension = new HTMLEmbedExtension();
