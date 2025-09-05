import { TextFormatExtension } from '@lexkit/editor/extensions/base';

/**
 * CodeFormatExtension - Provides inline code text formatting functionality
 *
 * This extension extends TextFormatExtension to provide inline code formatting
 * for selected text in the Lexical editor. It integrates with the toolbar system
 * and provides commands and state queries for inline code operations.
 *
 * @example
 * ```tsx
 * import { codeFormatExtension } from '@lexkit/editor/extensions/formatting/CodeFormatExtension';
 *
 * const extensions = [codeFormatExtension];
 * const editor = createEditorSystem(extensions);
 * ```
 */
export class CodeFormatExtension extends TextFormatExtension<'code'> {
  constructor() {
    super('code');
  }
}

export const codeFormatExtension = new CodeFormatExtension();
