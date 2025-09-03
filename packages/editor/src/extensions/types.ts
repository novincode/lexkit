import { LexicalEditor, TextFormatType } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { TranslationKeys } from '../locales';

export enum ExtensionCategory {
  Toolbar = 'toolbar',
  Sidebar = 'sidebar',
  ContextMenu = 'contextmenu',
  Floating = 'floating',
  // Add more as needed
}

export interface BaseExtensionConfig {
  showInToolbar?: boolean;
  category?: ExtensionCategory[];
  [key: string]: any;
}

export interface ToolbarItem {
  label: string;
  onClick: () => void;
  isActive?: () => boolean;
  component?: React.ComponentType<any>;
}

// Base for all extensions
export interface Extension<Name extends string = string, Config extends BaseExtensionConfig = BaseExtensionConfig, Commands extends {} = {}, Plugins extends ReactNode[] = ReactNode[]> {
  name: Name; // Literal for inference
  category: ExtensionCategory[];
  config: Config;
  configure?: (config: Partial<Config>) => Extension<Name, Config, Commands, Plugins>;
  register: (editor: LexicalEditor) => () => void;
  overrideUI?: (CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>) => Extension<Name, Config, Commands, Plugins>;
  overrideNodeRender?: (overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }) => Extension<Name, Config, Commands, Plugins>;
  getNodes?: () => any[];
  getPlugins?: () => Plugins;
  getCommands?: (editor: LexicalEditor) => Commands;
  // More: getToolbarItems?(): ToolbarItem<Commands>[];
}

// Infer unions from array of extensions
export type ExtractNames<Exts extends Extension[]> = Exts[number]['name'];
export type ExtractCommands<Exts extends Extension[]> = UnionToIntersection<Exts[number] extends { getCommands: (editor: LexicalEditor) => infer C } ? C : {}>;
export type ExtractPlugins<Exts extends Extension[]> = Exts[number] extends { getPlugins: () => infer P } ? P extends (infer T)[] ? T : never : never;

// Helper: Union to intersection for flat types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never)[any] extends (k: infer I) => void ? I : never;

// Base commands (always available)
interface BaseCommands {
  formatText: (format: TextFormatType, value?: boolean | string) => boolean;
  undo: () => boolean;
  redo: () => boolean;
  clearHistory: () => boolean;
}

// Context type, generic over Exts
export interface EditorContextType<Exts extends Extension[]> {
  editor: LexicalEditor | null;
  config?: EditorConfig;
  extensions: Exts;
  t: (key: TranslationKeys) => string;
  commands: BaseCommands & ExtractCommands<Exts>;
  listeners: {
    registerUpdate: (listener: (state: any) => void) => (() => void) | undefined;
    registerPaste: (listener: (event: ClipboardEvent) => boolean) => (() => void) | undefined;
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
  plugins: ExtractPlugins<Exts>[];
  hasExtension: (name: ExtractNames<Exts>) => boolean;
}

// Assuming EditorConfig is defined elsewhere, add if needed
export interface EditorConfig {
  theme?: any;
  [key: string]: any;
}
