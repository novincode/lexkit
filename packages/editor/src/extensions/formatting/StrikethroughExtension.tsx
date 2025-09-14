import { TextFormatExtension } from "@lexkit/editor/extensions/base";

/**
 * StrikethroughExtension - Provides strikethrough text formatting functionality
 *
 * This extension extends TextFormatExtension to provide strikethrough formatting
 * for selected text in the Lexical editor. It integrates with the toolbar system
 * and provides commands and state queries for strikethrough operations.
 *
 * @example
 * ```tsx
 * import { strikethroughExtension } from '@lexkit/editor/extensions/formatting/StrikethroughExtension';
 *
 * const extensions = [strikethroughExtension];
 * const editor = createEditorSystem(extensions);
 * ```
 */
export class StrikethroughExtension extends TextFormatExtension<"strikethrough"> {
  constructor() {
    super("strikethrough");
  }
}

export const strikethroughExtension = new StrikethroughExtension();
