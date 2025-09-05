import { TextFormatExtension } from '@repo/editor/extensions/base';

export class UnderlineExtension extends TextFormatExtension<'underline'> {
  constructor() {
    super('underline');
  }
}

export const underlineExtension = new UnderlineExtension();
