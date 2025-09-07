import { LexicalEditor, TextFormatType, EditorThemeClasses } from 'lexical';
import { ReactNode, CSSProperties } from 'react';
import { Extension, ExtensionCategory } from '@lexkit/editor/extensions';

export type { Extension, ExtensionCategory } from '../extensions';

/**
 * Theme configuration for individual nodes
 */
export interface NodeTheme {
  /** CSS class name for the node */
  className?: string;
  /** Inline CSS styles for the node */
  style?: CSSProperties;
}

/**
 * Configuration options for the Lexical editor
 */
export interface EditorConfig {
  /** Theme configuration for different node types */
  theme?: EditorThemeClasses;
  /** Placeholder text to display when editor is empty */
  placeholder?: string;
  /** Additional configuration options */
  [key: string]: any;
}

/**
 * Main context type for the Lexical editor with extensions
 *
 * This interface provides type-safe access to the editor instance,
 * commands, state queries, and extension management.
 *
 * @template Exts - Array of extension types
 */
export interface EditorContextType<Exts extends readonly Extension[]> {
  /** The Lexical editor instance */
  editor: LexicalEditor | null;
  /** Editor configuration */
  config: EditorConfig;
  /** Array of registered extensions */
  extensions: Exts;
  /** Dynamic commands aggregated from all extensions */
  commands: any;
  /** Dynamic active states from all extensions */
  activeStates: any;
  /** Event listeners for editor updates */
  listeners: {
    /** Register a listener for editor state updates */
    registerUpdate: (listener: (state: any) => void) => () => void;
    /** Register a listener for node mutations (optional) */
    registerMutation?: (listener: (mutations: any) => void) => () => void;
    /** Register a listener for paste events */
    registerPaste: (listener: (event: ClipboardEvent) => boolean) => () => void;
  };
  /** Export functionality */
  export: {
    /** Export editor content to HTML */
    toHTML: () => Promise<string>;
    /** Export editor content to Markdown */
    toMarkdown: () => Promise<string>;
    /** Export editor content to JSON */
    toJSON: () => any;
  };
  /** Import functionality */
  import: {
    /** Import HTML content into the editor */
    fromHTML: (html: string) => Promise<void>;
    /** Import Markdown content into the editor */
    fromMarkdown: (md: string) => Promise<void>;
    /** Import JSON content into the editor */
    fromJSON: (json: any) => void;
  };
  /** Direct access to the Lexical editor instance */
  lexical: LexicalEditor | null;
  /** API for managing extensions at runtime */
  extensionsAPI: {
    /** Add a new extension */
    add: (ext: Extension) => void;
    /** Remove an extension by name */
    remove: (name: string) => void;
    /** Reorder extensions by name array */
    reorder: (names: string[]) => void;
  };
  /** React plugins from extensions */
  plugins: ReactNode[];
  /** Check if a specific extension is registered */
  hasExtension: (name: Exts[number]['name']) => boolean;
}
