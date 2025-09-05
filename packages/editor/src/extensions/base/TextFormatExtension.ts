import { FORMAT_TEXT_COMMAND, LexicalEditor, TextFormatType, $getSelection, $isRangeSelection } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';

/**
 * Commands provided by text format extensions.
 * Generates toggle commands for text formatting (e.g., toggleBold, toggleItalic).
 */
export type TextFormatCommands<Name extends TextFormatType> = {
  [Key in `toggle${Capitalize<Name>}`]: () => void;
};

/**
 * Base extension for text formatting (bold, italic, underline, etc.).
 * Provides common functionality for text format extensions.
 *
 * @template Name - The text format type (e.g., 'bold', 'italic')
 */
export abstract class TextFormatExtension<Name extends TextFormatType> extends BaseExtension<
  Name,
  any,
  TextFormatCommands<Name>,
  Record<Name, () => Promise<boolean>>,
  ReactNode[]
> {
  /**
   * Creates a new text format extension.
   *
   * @param name - The text format name
   */
  constructor(name: Name) {
    super(name, [ExtensionCategory.Toolbar]);
    this.supportedFormats = [name];
  }

  /**
   * Registers the extension with the editor.
   * Text format extensions don't need special registration beyond the base.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function (no-op for text formats)
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Returns the toggle command for this text format.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with toggle command function
   */
  getCommands(editor: LexicalEditor): TextFormatCommands<Name> {
    const key = `toggle${this.name.charAt(0).toUpperCase() + this.name.slice(1)}` as keyof TextFormatCommands<Name>;
    return {
      [key]: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, this.name),
    } as any;
  }

  /**
   * Returns state query to check if the current selection has this format applied.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with format state query function
   */
  getStateQueries(editor: LexicalEditor): Record<Name, () => Promise<boolean>> {
    return {
      [this.name]: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              resolve(selection.hasFormat(this.name));
            } else {
              resolve(false);
            }
          });
        }),
    } as Record<Name, () => Promise<boolean>>;
  }
}
