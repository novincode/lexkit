import { LexicalEditor } from "lexical";
import { ReactNode } from "react";
import { BaseExtension } from "../extensions/base/BaseExtension";
import { BaseExtensionConfig, ExtensionCategory } from "../extensions/types";

/**
 * Configuration options for creating a custom extension
 */
export interface CreateExtensionConfig<
  Name extends string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[],
> {
  /** Unique name for the extension */
  name: Name;

  /** Categories this extension belongs to */
  category?: ExtensionCategory[];

  /** Default configuration */
  config?: Partial<Config>;

  /** Commands provided by this extension */
  commands?: (editor: LexicalEditor) => Commands;

  /** State query functions */
  stateQueries?: (editor: LexicalEditor) => StateQueries;

  /** React plugins/components */
  plugins?: Plugins;

  /** Initialization function called when extension is registered */
  initialize?: (editor: LexicalEditor) => (() => void) | void;

  /** Custom Lexical nodes */
  nodes?: any[];

  /** Text formats supported by this extension */
  supportedFormats?: readonly any[];
}

/**
 * Factory function to create a type-safe extension that extends BaseExtension.
 * Provides a simpler API for creating extensions while maintaining full type safety.
 *
 * @template Name - Literal type for the extension name
 * @template Config - Configuration object type
 * @template Commands - Commands provided by the extension
 * @template StateQueries - State query functions
 * @template Plugins - React plugins provided by the extension
 *
 * @param config - Configuration object for the extension
 * @returns A fully typed extension instance
 *
 * @example
 * ```tsx
 * const myExtension = createExtension({
 *   name: 'my-extension',
 *   commands: (editor) => ({
 *     myCommand: () => console.log('Hello!')
 *   }),
 *   stateQueries: (editor) => ({
 *     isActive: async () => true
 *   }),
 *   initialize: (editor) => {
 *     // Custom initialization
 *     return () => {
 *       // Cleanup function
 *     };
 *   }
 * });
 * ```
 */
export function createExtension<
  Name extends string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[],
>(
  config: CreateExtensionConfig<Name, Config, Commands, StateQueries, Plugins>,
): BaseExtension<Name, Config, Commands, StateQueries, Plugins> {
  return new (class extends BaseExtension<
    Name,
    Config,
    Commands,
    StateQueries,
    Plugins
  > {
    private _plugins: Plugins = [] as unknown as Plugins;
    private _nodes: any[] = [];
    private _initialize?: (editor: LexicalEditor) => (() => void) | void;

    constructor() {
      super(config.name, config.category || [ExtensionCategory.Toolbar]);

      // Set default config
      if (config.config) {
        this.config = { ...this.config, ...config.config };
      }

      // Store the provided functions
      this._initialize = config.initialize;

      // Set supported formats if provided
      if (config.supportedFormats) {
        this.supportedFormats = config.supportedFormats;
      }

      // Set nodes if provided
      if (config.nodes) {
        this._nodes = config.nodes;
      }

      // Set plugins if provided
      if (config.plugins) {
        this._plugins = config.plugins;
      }
    }

    register(editor: LexicalEditor): () => void {
      // Call the initialize function if provided
      const cleanup = this._initialize?.(editor);

      // Return cleanup function
      return () => {
        if (typeof cleanup === "function") {
          cleanup();
        }
      };
    }

    getNodes(): any[] {
      return this._nodes;
    }

    getPlugins(): Plugins {
      return this._plugins;
    }

    getCommands(editor: LexicalEditor): Commands {
      // Always create fresh commands with the current editor instance
      // This prevents stale editor references when components remount
      if (config.commands) {
        return config.commands(editor);
      }
      return {} as Commands;
    }

    getStateQueries(editor: LexicalEditor): StateQueries {
      // Always create fresh state queries with the current editor instance
      // This prevents stale editor references when components remount
      if (config.stateQueries) {
        return config.stateQueries(editor);
      }
      return {} as StateQueries;
    }
  })();
}
