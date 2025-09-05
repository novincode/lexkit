import { LexicalEditor, TextFormatType } from 'lexical';
import { ReactNode, CSSProperties } from 'react';
import { Extension, ExtensionCategory } from '@repo/editor/extensions';

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
  commands: any; // Dynamic commands from extensions
  activeStates: any; // Dynamic states from extensions
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
  lexical: LexicalEditor | null;
  extensionsAPI: {
    add: (ext: Extension) => void;
    remove: (name: string) => void;
    reorder: (names: string[]) => void;
  };
  plugins: ReactNode[];
  hasExtension: (name: Exts[number]['name']) => boolean;
}
