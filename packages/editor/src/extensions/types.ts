import { LexicalEditor, TextFormatType, EditorThemeClasses } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';

/** Categories that extensions can belong to */
export enum ExtensionCategory {
  Toolbar = 'toolbar',
  Sidebar = 'sidebar',
  ContextMenu = 'contextmenu',
  Floating = 'floating',
  // Add more as needed
}

/** Base configuration interface for all extensions */
export interface BaseExtensionConfig {
  showInToolbar?: boolean;
  category?: ExtensionCategory[];
  position?: 'before' | 'after';
  [key: string]: any;
}

/** Configuration for toolbar items */
export interface ToolbarItem {
  label: string;
  onClick: () => void;
  isActive?: () => boolean;
  component?: React.ComponentType<any>;
}

/**
 * Core extension interface that all extensions must implement.
 * Defines the contract for extensions in the LexKit system.
 *
 * @template Name - Literal type for the extension name
 * @template Config - Configuration object type
 * @template Commands - Commands provided by the extension
 * @template StateQueries - State query functions
 * @template Plugins - React plugins provided by the extension
 */
export interface Extension<Name extends string = string, Config extends BaseExtensionConfig = BaseExtensionConfig, Commands extends Record<string, any> = {}, StateQueries extends Record<string, () => Promise<boolean>> = {}, Plugins extends ReactNode[] = ReactNode[]> {
  /** Unique identifier for this extension */
  name: Name;

  /** Categories this extension belongs to */
  category: ExtensionCategory[];

  /** Configuration object */
  config: Config;

  /** Text formats supported by this extension */
  supportedFormats?: readonly TextFormatType[];

  /** Configure the extension with new settings */
  configure?: (config: Partial<Config>) => Extension<Name, Config, Commands, StateQueries, Plugins>;

  /** Register the extension with the Lexical editor */
  register: (editor: LexicalEditor) => () => void;

  /** Override the UI component for this extension */
  overrideUI?: (CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>) => Extension<Name, Config, Commands, StateQueries, Plugins>;

  /** Override node rendering */
  overrideNodeRender?: (overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }) => Extension<Name, Config, Commands, StateQueries, Plugins>;

  /** Get custom Lexical nodes */
  getNodes?: () => any[];

  /** Get React plugins */
  getPlugins: () => Plugins;

  /** Get commands provided by this extension */
  getCommands: (editor: LexicalEditor) => Commands;

  /** Get state query functions */
  getStateQueries?: (editor: LexicalEditor) => StateQueries;

  /** Get toolbar items (legacy) */
  // getToolbarItems?(): ToolbarItem<Commands>[];
}

// Merge commands (updated to use unknown for distribution)
type MergeCommands<T> = {
  [K in UnionKeys<T>]: T extends { [P in K]: infer V } ? V : never;
};

// Merge state queries (updated to use unknown for distribution, values as boolean)
type MergeStateQueries<T> = {
  [K in UnionKeys<T>]: boolean;
};

// Infer unions from array of extensions
export type ExtractNames<Exts extends readonly Extension[]> = Exts[number]['name'];
export type ExtractCommands<Exts extends readonly Extension[]> = MergeCommands<
  ReturnType<Exts[number]['getCommands']>
>;
export type ExtractPlugins<Exts extends readonly Extension[]> = ReturnType<Exts[number]['getPlugins']>[number];

// Helper: Union to intersection for flat types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never)[any] extends (k: infer I) => void ? I : never;

// Helper for union of keys
type UnionKeys<T> = T extends unknown ? keyof T : never;

// Extract state queries similarly
export type ExtractStateQueries<Exts extends readonly Extension[]> = MergeStateQueries<
  ReturnType<NonNullable<Exts[number]['getStateQueries']>>
> & ('history' extends ExtractNames<Exts> ? { canUndo: boolean; canRedo: boolean } : {});

// Base commands (always available)
export interface BaseCommands {
  formatText: (format: TextFormatType, value?: boolean | string) => void;
}

/**
 * Context type for the editor system, generic over the extensions array.
 * Provides strongly typed access to commands, state, and utilities.
 *
 * @template Exts - Array of extensions that define available functionality
 */
export interface EditorContextType<Exts extends readonly Extension[]> {
  /** Raw Lexical editor instance */
  editor: LexicalEditor | null;

  /** Editor configuration */
  config?: EditorConfig;

  /** Array of loaded extensions */
  extensions: Exts;

  /** Available commands from all extensions */
  commands: BaseCommands & ExtractCommands<Exts>;

  /** Current state of all extensions */
  activeStates: ExtractStateQueries<Exts>;

  /** Event listener registration functions */
  listeners: {
    registerUpdate: (listener: (state: any) => void) => (() => void) | undefined;
    registerPaste: (listener: (event: ClipboardEvent) => boolean) => (() => void) | undefined;
  };

  /** Export functions for different formats */
  export: {
    toHTML: () => Promise<string>;
    toMarkdown: () => Promise<string>;
    toJSON: () => any;
  };

  /** Import functions for different formats */
  import: {
    fromHTML: (html: string) => Promise<void>;
    fromMarkdown: (md: string) => Promise<void>;
    fromJSON: (json: any) => void;
  };

  /** Alias for the raw Lexical editor */
  lexical: LexicalEditor | null;

  /** API for managing extensions dynamically */
  extensionsAPI: {
    add: (ext: Extension) => void;
    remove: (name: string) => void;
    reorder: (names: string[]) => void;
  };

  /** React plugins from all extensions */
  plugins: ExtractPlugins<Exts>[];

  /** Check if a specific extension is loaded */
  hasExtension: (name: ExtractNames<Exts>) => boolean;
}

// Assuming EditorConfig is defined elsewhere, add if needed
export interface EditorConfig {
  theme?: EditorThemeClasses;
  [key: string]: any;
}
