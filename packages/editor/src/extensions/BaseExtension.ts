import { LexicalEditor } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { BaseExtensionConfig, Extension, ExtensionCategory } from './types';

export abstract class BaseExtension<Config extends BaseExtensionConfig = BaseExtensionConfig> implements Extension<Config> {
  name: string;
  category: ExtensionCategory[] = [ExtensionCategory.Toolbar];
  config: Config = {} as Config;
  private nodeOverrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean } = {};

  constructor(name: string, category: ExtensionCategory[] = [ExtensionCategory.Toolbar]) {
    this.name = name;
    this.category = category;
  }

  configure(config: Partial<Config>): Extension<Config> {
    this.config = { ...this.config, ...config };
    return this;
  }

  abstract register(editor: LexicalEditor): () => void;

  getNodes(): any[] {
    return [];
  }

  overrideUI(CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>): Extension<Config> {
    // For node rendering, perhaps
    return this;
  }

  overrideNodeRender(overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }): Extension<Config> {
    this.nodeOverrides = { ...this.nodeOverrides, ...overrides };
    return this;
  }

  getThemeContribution(): Record<string, string> {
    return {};
  }

  getPlugins(): React.ReactNode[] {
    return [];
  }
}
