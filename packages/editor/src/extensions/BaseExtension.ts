import { LexicalEditor, TextFormatType } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { BaseExtensionConfig, Extension, ExtensionCategory, ToolbarItem } from './types';

export abstract class BaseExtension<
  Name extends string = string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  StateQueries extends Record<string, () => Promise<boolean>> = {},
  Plugins extends ReactNode[] = ReactNode[]
> implements Extension<Name, Config, Commands, StateQueries, Plugins> {
  name: Name;
  category: ExtensionCategory[] = [ExtensionCategory.Toolbar];
  config: Config = {} as Config;
  supportedFormats: readonly TextFormatType[] = [];
  public nodeOverrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean } = {};

  constructor(name: Name, category: ExtensionCategory[] = [ExtensionCategory.Toolbar]) {
    this.name = name;
    this.category = category;
  }

  configure(config: Partial<Config>): Extension<Name, Config, Commands, StateQueries, Plugins> {
    this.config = { ...this.config, ...config };
    return this;
  }

  abstract register(editor: LexicalEditor): () => void;

  getNodes(): any[] {
    return [];
  }

  overrideUI(CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>): Extension<Name, Config, Commands, StateQueries, Plugins> {
    // For node rendering, perhaps
    return this;
  }

  overrideNodeRender(overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }): Extension<Name, Config, Commands, StateQueries, Plugins> {
    this.nodeOverrides = { ...this.nodeOverrides, ...overrides };
    return this;
  }

  getPlugins(): Plugins {
    return [] as unknown as Plugins;
  }

  getCommands(editor: LexicalEditor): Commands {
    return {} as Commands;
  }

  getStateQueries(editor: LexicalEditor): StateQueries {
    return {} as StateQueries;
  }

  getToolbarItems(commands: any): ToolbarItem[] {
    return [];
  }
}
