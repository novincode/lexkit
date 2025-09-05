import { TextFormatExtension } from '@lexkit/editor/extensions/base';
import { FORMAT_TEXT_COMMAND, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';

/**
 * Custom Underline Transformer for Markdown
 * Uses ++underline++ syntax (common convention for underline in extended markdown)
 */
export const UNDERLINE_TRANSFORMER = {
  format: ['underline'],
  tag: '++',
  type: 'text-format' as const,
};

/**
 * UnderlineExtension - Provides underline text formatting functionality
 *
 * This extension extends TextFormatExtension to provide underline formatting
 * for selected text in the Lexical editor. It integrates with the toolbar system
 * and provides commands and state queries for underline operations.
 *
 * Supports markdown syntax: ++underline++
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

  /**
   * Returns the markdown transformers for underline formatting.
   *
   * @returns Array containing the underline transformer
   */
  getMarkdownTransformers(): any[] {
    return [UNDERLINE_TRANSFORMER];
  }
}

export const underlineExtension = new UnderlineExtension();
