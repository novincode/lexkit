import React, { useState } from 'react';
import { createCustomNodeExtension } from '../custom/CustomNodeExtension';
import { $getSelection, $isRangeSelection, $getRoot, $createParagraphNode } from 'lexical';

// Types for the HTML embed extension
type HTMLEmbedCommands = {
  insertHTMLEmbed: (html?: string) => void;
  toggleHTMLPreview: () => void;
};

type HTMLEmbedQueries = {
  isHTMLEmbedSelected: () => Promise<boolean>;
  isHTMLPreviewMode: () => Promise<boolean>;
};

type HTMLEmbedPayload = {
  html: string;
  preview: boolean;
};

// Create the HTML embed extension using the factory
const { extension: HTMLEmbedExtension, $createCustomNode, jsxToDOM } = createCustomNodeExtension<
  'htmlEmbed',
  HTMLEmbedCommands,
  HTMLEmbedQueries
>({
  nodeType: 'htmlEmbed',
  isContainer: false, // DecoratorNode for embeds
  defaultPayload: { 
    html: '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;">\n  <h3>Custom HTML Block</h3>\n  <p>Edit this HTML to create your custom embed!</p>\n</div>', 
    preview: true 
  },
  render: ({ payload, nodeKey, isSelected, updatePayload }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localHTML, setLocalHTML] = useState('');
    const htmlPayload = payload as HTMLEmbedPayload;

    // Initialize local HTML when entering edit mode
    useState(() => {
      if (!htmlPayload.preview) {
        setLocalHTML(htmlPayload.html);
      }
    });

    // Show editor mode
    if (isEditing || !htmlPayload.preview) {
      return (
        <div
          style={{
            border: isSelected ? '2px solid #007ACC' : '2px dashed #ccc',
            borderRadius: '8px',
            padding: '12px',
            margin: '8px 0',
            backgroundColor: '#fafafa',
            fontFamily: 'monospace'
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>✏️ Edit HTML</span>
            <button
              onClick={() => {
                updatePayload({ html: localHTML, preview: true });
                setIsEditing(false);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                background: '#007ACC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Preview
            </button>
          </div>
          <textarea
            value={localHTML || htmlPayload.html}
            onChange={(e) => setLocalHTML(e.target.value)}
            onBlur={(e) => updatePayload({ html: e.target.value })}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px',
              resize: 'vertical'
            }}
            placeholder="Enter your HTML here..."
            autoFocus
          />
        </div>
      );
    }

    // Show preview mode
    return (
      <div
        style={{
          border: isSelected ? '2px solid #007ACC' : '1px solid #ddd',
          borderRadius: '8px',
          margin: '8px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
        onDoubleClick={() => {
          setLocalHTML(htmlPayload.html);
          setIsEditing(true);
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            padding: '2px'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLocalHTML(htmlPayload.html);
              setIsEditing(true);
              updatePayload({ preview: false });
            }}
            style={{
              padding: '4px 6px',
              fontSize: '10px',
              background: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
            title="Edit HTML (or double-click)"
          >
            ✏️ Edit
          </button>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: htmlPayload.html }}
          style={{
            minHeight: '40px',
            position: 'relative'
          }}
        />
      </div>
    );
  },
  createDOM: (config, node) => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.setAttribute('data-lexical-html-embed', 'true');
    
    // Include HTML content in attributes for serialization, but don't set innerHTML to avoid duplication in Visual
    const payload = (node as any).getPayload() as HTMLEmbedPayload;
    div.setAttribute('data-html-content', payload.html);
    
    return div;
  },
  updateDOM: (prevNode, dom, config) => {
    // Return false to trigger a re-render when payload changes
    return false;
  },
  // Add proper HTML serialization support
  importDOM: () => ({
    'div[data-lexical-html-embed]': (element: HTMLElement) => ({
      conversion: (): { node: any } => {
        const htmlContent = element.getAttribute('data-html-content') || element.innerHTML;
        const payload: HTMLEmbedPayload = {
          html: htmlContent,
          preview: true
        };
        return { node: $createCustomNode(payload) };
      },
      priority: 4 as const,
    }),
    // Also support a custom tag for cleaner HTML
    'html-embed': (element: HTMLElement) => ({
      conversion: (): { node: any } => {
        const htmlContent = element.textContent || element.innerHTML;
        const payload: HTMLEmbedPayload = {
          html: htmlContent,
          preview: true
        };
        return { node: $createCustomNode(payload) };
      },
      priority: 4 as const,
    }),
  }),
  exportDOM: (editor: any, { element, node }: { element: HTMLElement; node: any }) => {
    const payload = node.getPayload() as HTMLEmbedPayload;
    
    // Create a custom html-embed tag for clean serialization
    const htmlEmbedElement = document.createElement('html-embed');
    htmlEmbedElement.setAttribute('data-html-content', payload.html);
    htmlEmbedElement.textContent = payload.html;
    
    return { element: htmlEmbedElement };
  },
  commands: (editor) => ({
    insertHTMLEmbed: (html?: string) => {
      editor.update(() => {
        const payload: HTMLEmbedPayload = {
          html: html || '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;">\n  <h3>Custom HTML Block</h3>\n  <p>Edit this HTML to create your custom embed!</p>\n</div>',
          preview: false // Start in edit mode for new embeds
        };
        const node = $createCustomNode(payload);
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
            if ((node as any).__nodeType === 'htmlEmbed') {
              const currentPayload = (node as any).getPayload() as HTMLEmbedPayload;
              (node as any).setPayload({ preview: !currentPayload.preview });
            }
          });
        }
      });
    },
  }),
  stateQueries: (editor) => ({
    isHTMLEmbedSelected: () =>
      new Promise((resolve) => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            const hasHTMLEmbed = nodes.some((node) => (node as any).__nodeType === 'htmlEmbed');
            resolve(hasHTMLEmbed);
          } else {
            resolve(false);
          }
        });
      }),
    isHTMLPreviewMode: () =>
      new Promise((resolve) => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            const htmlEmbedNode = nodes.find((node) => (node as any).__nodeType === 'htmlEmbed');
            if (htmlEmbedNode) {
              const payload = (htmlEmbedNode as any).getPayload() as HTMLEmbedPayload;
              resolve(payload.preview);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        });
      }),
  }),
});

// Add utility methods for markdown serialization
const htmlEmbedUtils = {
  // Convert HTML embed to markdown (just return the HTML content, transformer handles wrapping)
  toMarkdown: (payload: HTMLEmbedPayload): string => {
    return payload.html;
  },
  
  // Parse markdown back to HTML embed
  fromMarkdown: (markdown: string): HTMLEmbedPayload | null => {
    const htmlCodeBlockRegex = /^```html\n([\s\S]*?)\n```$/;
    const match = markdown.match(htmlCodeBlockRegex);
    if (match && match[1]) {
      return {
        html: match[1],
        preview: true
      };
    }
    return null;
  },
  
  // Check if a node is an HTML embed
  isHTMLEmbedNode: (node: any): boolean => {
    return node && node.__nodeType === 'htmlEmbed';
  }
};

// Markdown transformer for HTML embeds
export const HTML_EMBED_MARKDOWN_TRANSFORMER = {
  dependencies: [],
  export: (node: any) => {
    if (htmlEmbedUtils.isHTMLEmbedNode(node)) {
      const payload = node.getPayload() as HTMLEmbedPayload;
      return '```html\n' + payload.html + '\n```';
    }
    return null;
  },
  regExp: /^```html\n([\s\S]*?)\n```$/m,
  replace: (parentNode: any, children: any[], match: RegExpMatchArray) => {
    const html = match[1] || '';
    const payload: HTMLEmbedPayload = { 
      html: html, 
      preview: true 
    };
    const embedNode = $createCustomNode(payload);
    parentNode.replace(embedNode);
  },
  type: 'element' as const,
};

// Create a singleton instance
const htmlEmbedExtension = HTMLEmbedExtension;

export { HTMLEmbedExtension, htmlEmbedExtension, $createCustomNode as $createHTMLEmbedNode, htmlEmbedUtils };
export type { HTMLEmbedCommands, HTMLEmbedQueries, HTMLEmbedPayload };
