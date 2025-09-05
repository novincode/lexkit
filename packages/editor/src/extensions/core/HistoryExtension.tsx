import { UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical';
import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@repo/editor/extensions/base';
import { ExtensionCategory } from '@repo/editor/extensions/types';
import { ReactNode } from 'react';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

/**
 * Commands provided by the history extension.
 */
export type HistoryCommands = {
  /** Undo the last action */
  undo: () => void;
  /** Redo the last undone action */
  redo: () => void;
  /** Clear the entire history stack */
  clearHistory: () => void;
};

/**
 * History extension providing undo/redo functionality.
 * Integrates with Lexical's built-in history system to provide
 * undo and redo capabilities with state tracking.
 *
 * @example
 * ```tsx
 * const extensions = [historyExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands, activeStates } = useEditor();
 *   return (
 *     <div>
 *       <button
 *         onClick={() => commands.undo()}
 *         disabled={!activeStates.canUndo}
 *       >
 *         Undo
 *       </button>
 *       <button
 *         onClick={() => commands.redo()}
 *         disabled={!activeStates.canRedo}
 *       >
 *         Redo
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export class HistoryExtension extends BaseExtension<
  'history',
  any,
  HistoryCommands,
  {},
  ReactNode[]
> {
  /**
   * Creates a new history extension instance.
   */
  constructor() {
    super('history', [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the Lexical editor.
   * No special registration needed as history is handled by Lexical internally.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function (no-op for history)
   */
  register(editor: LexicalEditor): () => void {
    return () => {};
  }

  /**
   * Returns the React plugins required for history functionality.
   *
   * @returns Array containing the HistoryPlugin component
   */
  getPlugins(): ReactNode[] {
    return [<HistoryPlugin key="history-plugin" />];
  }

  /**
   * Returns the commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing history commands
   */
  getCommands(editor: LexicalEditor): HistoryCommands {
    return {
      undo: () => {
        editor.focus();
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      },
      redo: () => {
        editor.focus();
        editor.dispatchCommand(REDO_COMMAND, undefined);
      },
      clearHistory: () => editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
    };
  }

  /**
   * Returns state query functions.
   * History states (canUndo, canRedo) are handled via event listeners in createEditorSystem.
   *
   * @param editor - The Lexical editor instance
   * @returns Empty object as states are handled externally
   */
  getStateQueries(editor: LexicalEditor): {} {
    return {};
  }
}

/**
 * Pre-configured history extension instance.
 * Ready to use in extension arrays.
 */
export const historyExtension = new HistoryExtension();
