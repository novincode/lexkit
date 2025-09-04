import { TextFormatExtension } from '@repo/editor/extensions/base';

export class BoldExtension extends TextFormatExtension<'bold'> {
  constructor() {
    super('bold');
  }
}

export const boldExtension = new BoldExtension();

export default boldExtension;