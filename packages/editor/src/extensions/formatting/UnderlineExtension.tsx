import { TextFormatExtension } from '@lexkit/editor/extensions/base';

/**
 * UnderlineExtension - Provides underline text formatting functionality
 *
 * This extension extends TextFormatExtension to provide underline formatting
 * for selected text in the Lexical editor. It integrates with the toolbar system
 * and provides commands and state queries for underline operations.
 *
 * @example
 * ```tsx
 * import { underlineExtension } from '@lexkit/editor/extensions/formatting/UnderlineExtension';
 *
 * const extensions = [underlineExtension];
 * const editor = createEditorSystem(extensions);
 * ```
 */
export class UnderlineExtension extends TextFormatExtension<'underline'> {
  constructor() {
    super('underline');
  }
}

export const underlineExtension = new UnderlineExtension();
