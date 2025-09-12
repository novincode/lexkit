import { RegisteredCodeSnippet } from '@/app/(docs)/lib/types'

const TYPE_DEFINITIONS_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'type-definitions-editor-config',
    code: `export interface EditorConfig {
  /** Theme configuration for different node types */
  theme?: LexKitTheme;
  /** Placeholder text to display when editor is empty */
  placeholder?: string;
  /** Additional configuration options */
  [key: string]: any;
}`,
    language: 'typescript',
    title: 'EditorConfig Interface',
    description: 'Configuration options for the Lexical editor'
  },
  {
    id: 'type-definitions-node-theme',
    code: `export interface NodeTheme {
  /** CSS class name for the node */
  className?: string;
  /** Inline CSS styles for the node */
  style?: CSSProperties;
}`,
    language: 'typescript',
    title: 'NodeTheme Interface',
    description: 'Theme configuration for individual nodes'
  },
  {
    id: 'type-definitions-editor-context-type',
    code: `export interface EditorContextType<Exts extends readonly Extension[]> {
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
  /** Plugins that render before children */
  pluginsBefore: ReactNode[];
  /** Plugins that render after children */
  pluginsAfter: ReactNode[];
  /** Check if a specific extension is registered */
  hasExtension: (name: Exts[number]['name']) => boolean;
}`,
    language: 'typescript',
    title: 'EditorContextType Interface',
    description: 'Main context type for the Lexical editor with extensions'
  },
  {
    id: 'type-definitions-extension-category-enum',
    code: `export enum ExtensionCategory {
  Toolbar = 'toolbar',
  Sidebar = 'sidebar',
  ContextMenu = 'contextmenu',
  Floating = 'floating',
  // Add more as needed
}`,
    language: 'typescript',
    title: 'ExtensionCategory Enum',
    description: 'Categories that extensions can belong to'
  },
  {
    id: 'type-definitions-base-extension-config',
    code: `export interface BaseExtensionConfig {
  showInToolbar?: boolean;
  category?: ExtensionCategory[];
  position?: 'before' | 'after';
  [key: string]: any;
}`,
    language: 'typescript',
    title: 'BaseExtensionConfig Interface',
    description: 'Base configuration interface for all extensions'
  },
  {
    id: 'type-definitions-extension-interface',
    code: `export interface Extension<Name extends string = string, Config extends BaseExtensionConfig = BaseExtensionConfig, Commands extends Record<string, any> = {}, StateQueries extends Record<string, () => Promise<boolean>> = {}, Plugins extends ReactNode[] = ReactNode[]> {
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
}`,
    language: 'typescript',
    title: 'Extension Interface',
    description: 'Core extension interface that all extensions must implement'
  },
  {
    id: 'type-definitions-base-commands',
    code: `export interface BaseCommands {
  formatText: (format: TextFormatType, value?: boolean | string) => void;
}`,
    language: 'typescript',
    title: 'BaseCommands Interface',
    description: 'Base commands that are always available'
  },
  {
    id: 'type-definitions-extract-types',
    code: `// Infer unions from array of extensions
export type ExtractNames<Exts extends readonly Extension[]> = Exts[number]['name'];
export type ExtractCommands<Exts extends readonly Extension[]> = MergeCommands<
  ReturnType<Exts[number]['getCommands']>
>;
export type ExtractPlugins<Exts extends readonly Extension[]> = ReturnType<Exts[number]['getPlugins']>[number];

// Extract state queries similarly
export type ExtractStateQueries<Exts extends readonly Extension[]> = MergeStateQueries<
  ReturnType<NonNullable<Exts[number]['getStateQueries']>>
>;`,
    language: 'typescript',
    title: 'Type Extraction Utilities',
    description: 'Utility types for extracting information from extension arrays'
  },
  {
    id: 'type-definitions-editor-context-type-extensions',
    code: `export interface EditorContextType<Exts extends readonly Extension[]> {
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

  /** State query functions from all extensions */
  stateQueries: Record<string, () => Promise<any>>;

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
}`,
    language: 'typescript',
    title: 'EditorContextType (Extensions)',
    description: 'Context type for the editor system, generic over the extensions array'
  },
  {
    id: 'type-definitions-typed-extension-usage',
    code: `const extensions = [
  boldExtension,
  italicExtension,
  linkExtension
] as const;

type MyEditorContext = EditorContextType<typeof extensions>;

// Now you have full type safety!
const MyEditor: React.FC = () => {
  const { commands, activeStates } = useEditor();
  // commands has all available commands with proper types
  // activeStates has all state queries with boolean types
};`,
    language: 'typescript',
    title: 'Typed Extension Usage',
    description: 'Creating type-safe extension arrays and editor contexts'
  }
]

export default TYPE_DEFINITIONS_CODES
