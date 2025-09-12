import { LexicalEditor, $getSelection, $isRangeSelection, PASTE_COMMAND, COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_CRITICAL, $createTextNode } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode, AutoLinkNode, $createLinkNode } from '@lexical/link';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { BaseExtensionConfig, ExtensionCategory } from '@lexkit/editor/extensions/types';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import React from 'react';

/**
 * Configuration for the link extension.
 */
export interface LinkConfig extends BaseExtensionConfig {
  /** 
   * Whether to automatically link URLs when pasted anywhere in the editor. 
   * When false, pasted URLs remain as plain text. Default: true 
   */
  autoLinkUrls?: boolean;
  /** 
   * Whether to link selected text when pasting URLs over it.
   * When false, pasting URLs over selected text replaces it with plain URL text.
   * Only applies when autoLinkUrls is true. Default: true 
   */
  linkSelectedTextOnPaste?: boolean;
  /** 
   * Whether to automatically link URLs as you type them in the editor.
   * Uses real-time pattern matching. Default: false 
   */
  autoLinkText?: boolean;
  /** URL validation function. Default: basic URL regex */
  validateUrl?: (url: string) => boolean;
}

/**
 * Commands provided by the link extension.
 */
export type LinkCommands = {
  insertLink: (url?: string, text?: string) => void;
  removeLink: () => void;
};

/**
 * State queries provided by the link extension.
 */
export type LinkStateQueries = {
  isLink: () => Promise<boolean>;
};

/**
 * Link extension for creating and managing hyperlinks.
 * Provides functionality to insert, edit, and remove links in the editor.
 * Includes configurable auto-linking of URLs on paste and in text.
 *
 * @example
 * ```tsx
 * const extensions = [linkExtension.configure({
 *   autoLinkUrls: true,
 *   linkSelectedTextOnPaste: false,
 *   autoLinkText: true
 * })] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands, activeStates } = useEditor();
 *   return (
 *     <button
 *       onClick={() => {
 *         const url = prompt('Enter URL:');
 *         if (url) commands.insertLink(url);
 *       }}
 *       className={activeStates.isLink ? 'active' : ''}
 *     >
 *       Link
 *     </button>
 *   );
 * }
 * ```
 */
export class LinkExtension extends BaseExtension<
  'link',
  LinkConfig,
  LinkCommands,
  LinkStateQueries,
  React.ReactElement[]
> {
  /**
   * Creates a new link extension instance.
   */
  constructor() {
    super('link', [ExtensionCategory.Toolbar]);
    this.config = {
      autoLinkUrls: true,
      linkSelectedTextOnPaste: true, // This should be true by default
      autoLinkText: false,
      validateUrl: (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }
    };
  }

  /**
   * Registers the extension with the editor.
   * Sets up link-related functionality and paste handling.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    // Register paste command handler with HIGHEST priority to override LinkPlugin completely
    const unregisterPaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const pastedText = clipboardData.getData('text/plain');
        if (!pastedText) return false;

        // Check if pasted text is a URL
        if (this.config.validateUrl!(pastedText)) {
          // Always prevent default to override LinkPlugin, then decide what to do
          event.preventDefault();

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            if (selection.isCollapsed()) {
              // No text selected, just insert the URL
              if (this.config.autoLinkUrls) {
                // Insert as link
                const linkNode = $createLinkNode(pastedText);
                linkNode.append($createTextNode(pastedText));
                selection.insertNodes([linkNode]);
              } else {
                // Insert as plain text
                selection.insertText(pastedText);
              }
            } else {
              // Text is selected
              if (this.config.autoLinkUrls && this.config.linkSelectedTextOnPaste) {
                // Keep selected text and make it a link with pasted URL
                const selectedText = selection.getTextContent();
                const linkNode = $createLinkNode(pastedText);
                linkNode.append($createTextNode(selectedText));
                selection.insertNodes([linkNode]);
              } else {
                // Replace selected text with pasted URL as plain text
                // First delete the selected text, then insert the new text
                selection.removeText();
                selection.insertText(pastedText);
              }
            }
          });

          return true; // Always return true to prevent LinkPlugin from handling
        }

        return false; // Not a URL, let other handlers deal with it
      },
      COMMAND_PRIORITY_CRITICAL // Maximum priority to ensure we override LinkPlugin
    );

    return () => {
      unregisterPaste();
    };
  }

  /**
   * Returns the Lexical nodes provided by this extension.
   *
   * @returns Array containing the LinkNode and optionally AutoLinkNode
   */
  getNodes(): any[] {
    const nodes = [LinkNode];
    if (this.config.autoLinkText) {
      nodes.push(AutoLinkNode);
    }
    return nodes;
  }

  /**
   * Returns React plugins provided by this extension.
   *
   * @returns Array containing the LinkPlugin and optionally AutoLinkPlugin
   */
  getPlugins(): React.ReactElement[] {
    const plugins: React.ReactElement[] = [];
    
    // Always include LinkPlugin for basic link functionality (clicking, editing existing links)
    // Our paste handler with CRITICAL priority will override its paste behavior
    plugins.push(<LinkPlugin key="link-plugin" validateUrl={this.config.validateUrl} />);
    
    if (this.config.autoLinkText) {
      const urlMatcher = (text: string) => {
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const match = urlRegex.exec(text);
        if (match && this.config.validateUrl!(match[0])) {
          return {
            text: match[0],
            url: match[0],
            index: match.index,
            length: match[0].length,
          };
        }
        return null;
      };
      plugins.push(<AutoLinkPlugin key="auto-link" matchers={[urlMatcher]} />);
    }
    return plugins;
  }

  /**
   * Returns commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with link command functions
   */
  getCommands(editor: LexicalEditor): LinkCommands {
    return {
      insertLink: (url?: string, text?: string) => {
        if (url) {
          // If text is provided, insert it first, then apply link
          if (text) {
            editor.update(() => {
              const selection = $getSelection();
              if (selection) {
                selection.insertText(text);
              }
            });
          }

          // Apply link to current selection
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        } else {
          // Prompt for URL if not provided
          const linkUrl = prompt('Enter URL:');
          if (linkUrl) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
          }
        }
      },

      removeLink: () => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
    };
  }

  /**
   * Returns state query functions provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with link state query functions
   */
  getStateQueries(editor: LexicalEditor): LinkStateQueries {
    return {
      isLink: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (selection && $isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              const node = nodes[0];
              if (node) {
                const parent = node.getParent();
                resolve($isLinkNode(parent) || $isLinkNode(node));
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          });
        })
    };
  }
}

/**
 * Pre-configured link extension instance.
 * Ready to use in extension arrays.
 */
export const linkExtension = new LinkExtension();

export default linkExtension;
