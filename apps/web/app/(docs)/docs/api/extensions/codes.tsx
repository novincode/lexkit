import { RegisteredCodeSnippet } from "@/app/(docs)/lib/types";

const EXTENSIONS_API_CODES: RegisteredCodeSnippet[] = [
  {
    id: "extensions-create-extension-signature",
    code: `export function createExtension<
  Name extends string,
  Config extends BaseExtensionConfig,
  Commands extends Record<string, any>,
  StateQueries extends Record<string, () => Promise<boolean>>,
  Plugins extends ReactNode[]
>(
  config: CreateExtensionConfig<Name, Config, Commands, StateQueries, Plugins>
): BaseExtension<Name, Config, Commands, StateQueries, Plugins>`,
    language: "typescript",
    title: "createExtension Type Signature",
    description: "The complete type signature for the createExtension function",
  },
  {
    id: "extensions-create-extension-example",
    code: `const myExtension = createExtension({
  name: 'my-extension',
  commands: (editor) => ({
    myCommand: () => console.log('Hello!'),
  }),
  stateQueries: (editor) => ({
    isActive: async () => true,
  }),
  initialize: (editor) => {
    console.log('Extension initialized');
    return () => {
      console.log('Extension cleaned up');
    };
  }
});`,
    language: "typescript",
    title: "Creating an extension with createExtension",
    description:
      "Example of using createExtension to create a functional extension",
  },
  {
    id: "extensions-base-extension-signature",
    code: `export abstract class BaseExtension<
  Name extends string = string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[]
> implements Extension<Name, Config, Commands, StateQueries, Plugins> {
  // Properties and methods...
}`,
    language: "typescript",
    title: "BaseExtension Class Definition",
    description:
      "The abstract base class for creating extensions with OOP patterns",
  },
  {
    id: "extensions-base-extension-example",
    code: `class MyExtension extends BaseExtension<'my-extension'> {
  constructor() {
    super('my-extension');
  }

  register(editor: LexicalEditor): () => void {
    // Registration logic
    return () => {
      // Cleanup logic
    };
  }

  getCommands(editor: LexicalEditor) {
    return {
      myCommand: () => console.log('Hello!'),
    };
  }

  getStateQueries(editor: LexicalEditor) {
    return {
      isActive: async () => true,
    };
  }
}

const myExtension = new MyExtension();`,
    language: "typescript",
    title: "Creating an extension with BaseExtension",
    description: "Example of extending BaseExtension for OOP-style extensions",
  },
  {
    id: "extensions-extension-interface",
    code: `export interface Extension<
  Name extends string = string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[]
> {
  name: Name;
  category: ExtensionCategory[];
  config: Config;
  supportedFormats: readonly TextFormatType[];

  register(editor: LexicalEditor): () => void;
  getCommands(editor: LexicalEditor): Commands;
  getStateQueries(editor: LexicalEditor): StateQueries;
  getPlugins(): Plugins;
  getNodes(): any[];
  configure(config: Partial<Config>): this;
}`,
    language: "typescript",
    title: "Extension Interface Definition",
    description: "The core Extension interface that all extensions implement",
  },
  {
    id: "extensions-extension-category-enum",
    code: `export enum ExtensionCategory {
  Toolbar = 'toolbar',
  Sidebar = 'sidebar',
  ContextMenu = 'context-menu',
  StatusBar = 'status-bar',
  Core = 'core',
  Formatting = 'formatting',
  Media = 'media',
  Export = 'export',
  Custom = 'custom'
}`,
    language: "typescript",
    title: "Extension Categories",
    description: "Available categories for organizing extensions",
  },
  {
    id: "extensions-base-extension-config",
    code: `export interface BaseExtensionConfig {
  /** Whether the extension is enabled */
  enabled?: boolean;

  /** Priority for extension loading (higher = loaded first) */
  priority?: number;

  /** Plugin position relative to editor content */
  position?: 'before' | 'after';

  /** Custom CSS classes for styling */
  className?: string;

  /** Additional configuration properties */
  [key: string]: any;
}`,
    language: "typescript",
    title: "Base Configuration Interface",
    description: "Common configuration options for all extensions",
  },
];

export default EXTENSIONS_API_CODES;
