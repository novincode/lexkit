import { TextFormatExtension } from '@lexkit/editor/extensions/base';

/**
 * Italic text formatting extension.
 * Provides italic text formatting functionality with toggle command and state tracking.
 */
export class ItalicExtension extends TextFormatExtension<'italic'> {
  /**
   * Creates a new italic extension instance.
   */
  constructor() {
    super('italic');
  }
}

/**
 * Pre-configured italic extension instance.
 * Ready to use in extension arrays.
 */
export const italicExtension = new ItalicExtension();
