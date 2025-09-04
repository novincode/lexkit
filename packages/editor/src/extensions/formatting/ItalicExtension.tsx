import { TextFormatExtension } from '@repo/editor/extensions/base';

export class ItalicExtension extends TextFormatExtension<'italic'> {
  constructor() {
    super('italic');
  }
}

export const italicExtension = new ItalicExtension();
