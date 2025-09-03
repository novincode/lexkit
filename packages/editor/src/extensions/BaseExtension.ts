import { LexicalEditor, TextFormatType } from 'lexical';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { BaseExtensionConfig, Extension, ExtensionCategory, ToolbarItem } from './types';

export abstract class BaseExtension<
  Name extends string = string,
  Config extends BaseExtensionConfig = BaseExtensionConfig,
  Commands extends Record<string, any> = {},
  Plugins extends ReactNode[] = ReactNode[]
> implements Extension<Name, Config, Commands, Plugins> {
  name: Name;
  category: ExtensionCategory[] = [ExtensionCategory.Toolbar];
  config: Config = {} as Config;
  supportedFormats: readonly TextFormatType[] = [];
  private nodeOverrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean } = {};

  constructor(name: Name, category: ExtensionCategory[] = [ExtensionCategory.Toolbar]) {
    this.name = name;
    this.category = category;
  }

  configure(config: Partial<Config>): Extension<Name, Config, Commands, Plugins> {
    this.config = { ...this.config, ...config };
    return this;
  }

  abstract register(editor: LexicalEditor): () => void;

  getNodes(): any[] {
    return [];
  }

  overrideUI(CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>): Extension<Name, Config, Commands, Plugins> {
    // For node rendering, perhaps
    return this;
  }

  overrideNodeRender(overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }): Extension<Name, Config, Commands, Plugins> {
    this.nodeOverrides = { ...this.nodeOverrides, ...overrides };
    return this;
  }

  getPlugins(): Plugins {
    return [] as unknown as Plugins;
  }

  getCommands(editor: LexicalEditor): Commands {
    return {} as Commands;
  }

  getStateQueries(editor: LexicalEditor): Record<string, () => Promise<boolean>> {
    return {};
  }

  getToolbarItems(commands: any): ToolbarItem[] {
    return [];
  }
}
