import { useContext } from 'react';
import { EditorContext } from './EditorProvider';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND, TextFormatType } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension, ComponentRegistry } from './types';
import { componentRegistry } from '../components/registry';

export function useEditorLogic(editor: LexicalEditor | null, config: EditorConfig, extensions: Extension[], lazyExports: any) {
  const { t } = useTranslation();

  return {
    editor,
    config,
    components: componentRegistry,
    extensions,
    t: t as any,
    commands: {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
      undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
      redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
      clearHistory: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
      isActive: (type: string) => false, // TODO: Implement based on selection
    },
    listeners: {
      registerUpdate: (listener: (state: any) => void) => editor?.registerUpdateListener(listener) || (() => {}),
      registerPaste: (listener: (event: ClipboardEvent) => boolean) => editor?.registerCommand(PASTE_COMMAND, listener, 4) || (() => {}),
    },
    export: {
      toHTML: lazyExports.toHTML,
      toMarkdown: lazyExports.toMarkdown,
      toJSON: () => editor?.getEditorState().toJSON(),
    },
    import: {
      fromHTML: lazyExports.fromHTML,
      fromMarkdown: lazyExports.fromMarkdown,
      fromJSON: (json: any) => editor?.setEditorState(editor.parseEditorState(json)),
    },
    history: {
      undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
      redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
      clear: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
    },
    lexical: editor,
    extensionsAPI: {
      add: (ext: Extension) => {}, // TODO: Implement state management
      remove: (name: string) => {},
      reorder: (names: string[]) => {},
    },
  } as EditorContextType;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
