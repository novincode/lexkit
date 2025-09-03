import { TextFormatExtension } from '../TextFormatExtension';

export class BoldExtension extends TextFormatExtension<'bold'> {
  constructor() {
    super('bold');
  }
}

export const boldExtension = new BoldExtension();