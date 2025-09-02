import { LexicalEditor } from 'lexical';
import { ReactNode, ComponentType } from 'react';

export interface EditorConfig {
  theme?: string;
  placeholder?: string;
  [key: string]: any;
}

export interface ComponentRegistry {
  [key: string]: (props: any) => ReactNode;
}

export interface Extension {
  register: (editor: LexicalEditor) => () => void;
  UI?: ComponentType;
}

export interface EditorContextType {
  editor: LexicalEditor | null;
  config: EditorConfig;
  components: ComponentRegistry;
  extensions: Extension[];
  t: (key: string) => string;
  lexical: LexicalEditor | null;
}
