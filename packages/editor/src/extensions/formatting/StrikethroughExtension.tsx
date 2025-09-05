import { TextFormatExtension } from '@repo/editor/extensions/base';

export class StrikethroughExtension extends TextFormatExtension<'strikethrough'> {
  constructor() {
    super('strikethrough');
  }
}

export const strikethroughExtension = new StrikethroughExtension();
