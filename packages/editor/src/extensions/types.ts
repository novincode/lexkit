import { LexicalEditor } from 'lexical';
import { ComponentType, CSSProperties } from 'react';

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
  nodeClassName?: string;
  nodeStyle?: CSSProperties;
  [key: string]: any;
}

export interface Extension<Config extends BaseExtensionConfig = BaseExtensionConfig> {
  name: string;
  category: ExtensionCategory[];
  configure?: (config: Partial<Config>) => Extension<Config>;
  register: (editor: LexicalEditor) => () => void;
  getUI?: () => ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }> | null;
  overrideUI?: (CustomUI: ComponentType<{ selected?: boolean; className?: string; style?: CSSProperties; [key: string]: any }>) => Extension<Config>;
  overrideNodeRender?: (overrides: { createDOM?: (config: any) => HTMLElement; updateDOM?: (prev: any, next: any, dom: HTMLElement) => boolean }) => Extension<Config>;
  getNodes?: () => any[];
}
