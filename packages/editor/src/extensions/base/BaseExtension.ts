import { LexicalEditor, TextFormatType } from "lexical";
import { ComponentType, CSSProperties, ReactNode } from "react";
import {
  BaseExtensionConfig,
  Extension,
  ExtensionCategory,
  ToolbarItem,
} from "@lexkit/editor/extensions/types";

/**
 * Abstract base class for all LexKit extensions.
 * Provides default implementations and common functionality for extensions.
 *
 * @template Name - The literal name of the extension
 * @template Config - Configuration object type
 * @template Commands - Commands provided by this extension
 * @template StateQueries - State query functions provided by this extension
 * @template Plugins - React plugins/components provided by this extension
 */
export abstract class BaseExtension<
  Name extends string = string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[],
> implements Extension<Name, Config, Commands, StateQueries, Plugins>
{
  /** The unique name identifier for this extension */
  name: Name;

  /** Categories this extension belongs to (toolbar, sidebar, etc.) */
  category: ExtensionCategory[] = [ExtensionCategory.Toolbar];

  /** Configuration object for this extension */
  config: Config = {} as Config;

  /** Text formats supported by this extension */
  supportedFormats: readonly TextFormatType[] = [];

  /** Node rendering overrides */
  public nodeOverrides: {
    createDOM?: (config: any) => HTMLElement;
    updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean;
  } = {};

  /**
   * Creates a new extension instance.
   *
   * @param name - The unique name for this extension
   * @param category - Categories this extension belongs to
   */
  constructor(
    name: Name,
    category: ExtensionCategory[] = [ExtensionCategory.Toolbar],
  ) {
    this.name = name;
    this.category = category;
  }

  /**
   * Configures the extension with new settings.
   * Returns a new instance with the updated configuration.
   *
   * @param config - Partial configuration to merge with existing config
   * @returns New extension instance with updated config
   */
  configure(
    config: Partial<Config>,
  ): Extension<Name, Config, Commands, StateQueries, Plugins> {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Registers the extension with the Lexical editor.
   * Override this method to set up event listeners, commands, etc.
   *
   * @param editor - The Lexical editor instance
   * @returns Cleanup function to unregister the extension
   */
  abstract register(editor: LexicalEditor): () => void;

  /**
   * Returns custom Lexical nodes provided by this extension.
   *
   * @returns Array of Lexical node classes
   */
  getNodes(): any[] {
    return [];
  }

  /**
   * Allows overriding the UI component for this extension.
   *
   * @param CustomUI - Custom React component to use
   * @returns This extension instance for chaining
   */
  overrideUI(
    CustomUI: ComponentType<{
      selected?: boolean;
      className?: string;
      style?: CSSProperties;
      [key: string]: any;
    }>,
  ): Extension<Name, Config, Commands, StateQueries, Plugins> {
    // For node rendering, perhaps
    return this;
  }

  /**
   * Overrides node rendering behavior.
   *
   * @param overrides - DOM creation and update functions
   * @returns This extension instance for chaining
   */
  overrideNodeRender(overrides: {
    createDOM?: (config: any) => HTMLElement;
    updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean;
  }): Extension<Name, Config, Commands, StateQueries, Plugins> {
    this.nodeOverrides = { ...this.nodeOverrides, ...overrides };
    return this;
  }

  /**
   * Returns React plugins/components provided by this extension.
   *
   * @returns Array of React nodes to render
   */
  getPlugins(): Plugins {
    return [] as unknown as Plugins;
  }

  /**
   * Returns commands provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing command functions
   */
  getCommands(editor: LexicalEditor): Commands {
    return {} as Commands;
  }

  /**
   * Returns state query functions provided by this extension.
   *
   * @param editor - The Lexical editor instance
   * @returns Object containing state query functions
   */
  getStateQueries(editor: LexicalEditor): StateQueries {
    return {} as StateQueries;
  }

  /**
   * Returns toolbar items for this extension.
   *
   * @param commands - Available commands from all extensions
   * @returns Array of toolbar item configurations
   */
  getToolbarItems(commands: any): ToolbarItem[] {
    return [];
  }
}
