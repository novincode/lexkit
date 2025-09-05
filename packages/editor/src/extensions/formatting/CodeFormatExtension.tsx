import { TextFormatExtension } from '@repo/editor/extensions/base';

export class CodeFormatExtension extends TextFormatExtension<'code'> {
  constructor() {
    super('code');
  }
}

export const codeFormatExtension = new CodeFormatExtension();
