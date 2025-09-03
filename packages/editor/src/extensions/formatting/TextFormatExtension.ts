import { FORMAT_TEXT_COMMAND, LexicalEditor, TextFormatType, $getSelection, $isRangeSelection } from 'lexical';
import { BaseExtension } from '../BaseExtension';
import { ExtensionCategory } from '../types';
import { ReactNode } from 'react';

export type TextFormatCommands<Name extends TextFormatType> = {
  [Key in `toggle${Capitalize<Name>}`]: () => void;
};

export abstract class TextFormatExtension<Name extends TextFormatType> extends BaseExtension<
  Name,
  any,
  TextFormatCommands<Name>,
  ReactNode[]
> {
  constructor(name: Name) {
    super(name, [ExtensionCategory.Toolbar]);
    this.supportedFormats = [name];
  }

  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  getCommands(editor: LexicalEditor): TextFormatCommands<Name> {
    const key = `toggle${this.name.charAt(0).toUpperCase() + this.name.slice(1)}` as keyof TextFormatCommands<Name>;
    return {
      [key]: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, this.name),
    } as any;
  }

  getStateQueries(editor: LexicalEditor): Record<string, () => Promise<boolean>> {
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
    };
  }
}
