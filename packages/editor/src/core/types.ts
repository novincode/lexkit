import { LexicalEditor, TextFormatType } from 'lexical';
import { ReactNode, CSSProperties } from 'react';
import { Extension, ExtensionCategory } from '../extensions';

export type { Extension, ExtensionCategory } from '../extensions';

export interface NodeTheme {
  className?: string;
  style?: CSSProperties;
}

export interface EditorConfig {
  theme?: Record<string, any>;
  placeholder?: string;
  [key: string]: any;
}

export interface EditorContextType<Exts extends readonly Extension[]> {
  editor: LexicalEditor | null;
  config: EditorConfig;
  extensions: Exts;
  commands: {
    formatText: (format: TextFormatType, value?: boolean | string) => void;
    insertNode?: (type: string, payload: any) => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    insertUnorderedList: () => void;
    insertOrderedList: () => void;
    toggleUnorderedList: () => void;
    toggleOrderedList: () => void;
    isActive: (type: string) => boolean;
  };
  listeners: {
    registerUpdate: (listener: (state: any) => void) => () => void;
    registerMutation?: (listener: (mutations: any) => void) => () => void;
    registerPaste: (listener: (event: ClipboardEvent) => boolean) => () => void;
  };
  export: {
    toHTML: () => Promise<string>;
    toMarkdown: () => Promise<string>;
    toJSON: () => any;
  };
  import: {
    fromHTML: (html: string) => Promise<void>;
    fromMarkdown: (md: string) => Promise<void>;
    fromJSON: (json: any) => void;
  };
  history: {
    undo: () => void;
    redo: () => void;
    clear: () => void;
  };
  lexical: LexicalEditor | null;
  extensionsAPI: {
    add: (ext: Extension) => void;
    remove: (name: string) => void;
    reorder: (names: string[]) => void;
  };
  plugins: ReactNode[];
  hasExtension: (name: Exts[number]['name']) => boolean;
}
