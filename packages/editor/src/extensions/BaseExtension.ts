import { LexicalEditor } from 'lexical';
import { ComponentType, CSSProperties } from 'react';
import { BaseExtensionConfig, Extension, ExtensionCategory } from './types';

export abstract class BaseExtension<Config extends BaseExtensionConfig = BaseExtensionConfig> implements Extension<Config> {
  name: string;
  category: ExtensionCategory[] = [ExtensionCategory.Toolbar];
  protected config: Config = {} as Config;
  private customUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null = null;
  private nodeOverrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean } = {};

  constructor(name: string, category: ExtensionCategory[] = [ExtensionCategory.Toolbar]) {
    this.name = name;
    this.category = category;
  }

  configure(config: Partial<Config>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  abstract register(editor: LexicalEditor): () => void;

  getNodes(): any[] {
    return [];
  }

  getUI(): ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null {
    return this.customUI;
  }

  overrideUI(CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>): this {
    this.customUI = CustomUI;
    return this;
  }

  overrideNodeRender(overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }): this {
    this.nodeOverrides = { ...this.nodeOverrides, ...overrides };
    return this;
  }

  getNodeOverrides() {
    return this.nodeOverrides;
  }
}
