import { LexicalEditor, $getSelection, $isRangeSelection, PASTE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode } from '@lexical/link';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { BaseExtensionConfig, ExtensionCategory } from '@lexkit/editor/extensions/types';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import React from 'react';

/**
 * Configuration for the link extension.
 */
export interface LinkConfig extends BaseExtensionConfig {
  /** Whether to automatically link URLs when pasted. Default: true */
  autoLinkUrls?: boolean;
  /** Whether to link selected text when pasting URLs. Default: true */
  linkSelectedTextOnPaste?: boolean;
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
 * Includes configurable auto-linking of URLs on paste.
 *
 * @example
 * ```tsx
 * const extensions = [linkExtension] as const;
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
      linkSelectedTextOnPaste: true,
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
    // Register paste command handler for auto-linking
    const unregisterPaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        if (!this.config.autoLinkUrls) return false;

        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const pastedText = clipboardData.getData('text/plain');
        if (!pastedText) return false;

        // Check if pasted text is a URL
        if (this.config.validateUrl!(pastedText)) {
          event.preventDefault();

          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // If text is selected and linkSelectedTextOnPaste is enabled
              if (!selection.isCollapsed() && this.config.linkSelectedTextOnPaste) {
                // Replace selected text with the URL and link it
                selection.insertText(pastedText);
                // Apply link to the newly inserted text
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, pastedText);
              } else {
                // Insert as link
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, pastedText);
                selection.insertText(pastedText);
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              }
            }
          });

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      unregisterPaste();
    };
  }

  /**
   * Returns the Lexical nodes provided by this extension.
   *
   * @returns Array containing the LinkNode
   */
  getNodes(): any[] {
    return [LinkNode];
  }

  /**
   * Returns React plugins provided by this extension.
   *
   * @returns Array containing the LinkPlugin
   */
  getPlugins(): React.ReactElement[] {
    return [<LinkPlugin key="link-plugin" validateUrl={this.config.validateUrl} />];
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
