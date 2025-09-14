import {
  FORMAT_TEXT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  LexicalEditor,
  TextFormatType,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { BaseExtension } from "@lexkit/editor/extensions/base";
import { ExtensionCategory } from "@lexkit/editor/extensions/types";
import { ReactNode } from "react";

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
 * @template Name - The text format name (e.g., 'bold', 'italic')
 */
export abstract class TextFormatExtension<
  Name extends TextFormatType,
> extends BaseExtension<
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
   * Text format extensions register listeners for INSERT_PARAGRAPH_COMMAND and INSERT_LINE_BREAK_COMMAND
   * to handle formatting behavior when Enter/Shift+Enter is pressed.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    // Register listener for INSERT_PARAGRAPH_COMMAND to clear formatting when Enter is pressed
    const unregisterParagraph = editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        // Only toggle off the format if it's currently active
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) && selection.hasFormat(this.name)) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, this.name);
          }
        });
        return false; // Allow the default paragraph insertion to continue
      },
      1, // COMMAND_PRIORITY_LOW
    );

    // Register listener for INSERT_LINE_BREAK_COMMAND to preserve formatting when Shift+Enter is pressed
    const unregisterLineBreak = editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => {
        // Don't clear formatting when Shift+Enter is pressed (preserves formatting for line break)
        return false; // Allow the default line break insertion to continue
      },
      1, // COMMAND_PRIORITY_LOW
    );

    return () => {
      unregisterParagraph();
      unregisterLineBreak();
    };
  }

  /**
   * Returns the toggle command for this text format.
   *
   * @param editor - The Lexical editor instance
   * @returns Object with toggle command function
   */
  getCommands(editor: LexicalEditor): TextFormatCommands<Name> {
    const key =
      `toggle${this.name.charAt(0).toUpperCase() + this.name.slice(1)}` as keyof TextFormatCommands<Name>;
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
