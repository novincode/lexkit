import { LexicalEditor, TextFormatType } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';

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
export interface Extension<Name extends string = string, Config extends BaseExtensionConfig = BaseExtensionConfig, Commands extends Record<string, any> = {}, Plugins extends ReactNode[] = ReactNode[]> {
  name: Name; // Literal for inference
  category: ExtensionCategory[];
  config: Config;
  supportedFormats?: readonly TextFormatType[];
  configure?: (config: Partial<Config>) => Extension<Name, Config, Commands, Plugins>;
  register: (editor: LexicalEditor) => () => void;
  overrideUI?: (CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>) => Extension<Name, Config, Commands, Plugins>;
  overrideNodeRender?: (overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }) => Extension<Name, Config, Commands, Plugins>;
  getNodes?: () => any[];
  getPlugins: () => Plugins;
  getCommands: (editor: LexicalEditor) => Commands;
  getStateQueries?: (editor: LexicalEditor) => Record<string, () => Promise<boolean>>;  // All queries async now
  // More: getToolbarItems?(): ToolbarItem<Commands>[];
}

// Helper: Merge union of objects into one object
type MergeCommands<T> = {
  [K in T extends any ? keyof T : never]: T extends { [P in K]: any } ? T[K] : never;
};

// Infer unions from array of extensions
export type ExtractNames<Exts extends readonly Extension[]> = Exts[number]['name'];
export type ExtractCommands<Exts extends readonly Extension[]> = MergeCommands<
  ReturnType<Exts[number]['getCommands']>
>;
export type ExtractPlugins<Exts extends readonly Extension[]> = ReturnType<Exts[number]['getPlugins']>[number];

// Helper: Union to intersection for flat types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never)[any] extends (k: infer I) => void ? I : never;

// Base commands (always available)
export interface BaseCommands {
  formatText: (format: TextFormatType, value?: boolean | string) => void;
}

// Context type, generic over Exts
export interface EditorContextType<Exts extends readonly Extension[]> {
  editor: LexicalEditor | null;
  config?: EditorConfig;
  extensions: Exts;
  commands: BaseCommands & ExtractCommands<Exts>;
  activeStates: Record<string, boolean>;
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
