import { TextFormatExtension } from '../TextFormatExtension';

export class ItalicExtension extends TextFormatExtension<'italic'> {
  constructor() {
    super('italic');
  }
}

export const italicExtension = new ItalicExtension();
