import { TextFormatExtension } from "@lexkit/editor/extensions/base";

/**
 * Bold text formatting extension.
 * Provides bold text formatting functionality with toggle command and state tracking.
 *
 * @example
 * ```tsx
 * const extensions = [boldExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands, activeStates } = useEditor();
 *   return (
 *     <button
 *       onClick={() => commands.toggleBold()}
 *       className={activeStates.bold ? 'active' : ''}
 *     >
 *       Bold
 *     </button>
 *   );
 * }
 * ```
 */
export class BoldExtension extends TextFormatExtension<"bold"> {
  /**
   * Creates a new bold extension instance.
   */
  constructor() {
    super("bold");
  }
}

/**
 * Pre-configured bold extension instance.
 * Ready to use in extension arrays.
 */
export const boldExtension = new BoldExtension();

export default boldExtension;
