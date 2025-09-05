import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import React from 'react';

/**
 * Floating toolbar item configuration
 */
export type FloatingToolbarItem = {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
};

/**
 * Floating toolbar configuration
 */
export type FloatingToolbarConfig = {
  items: FloatingToolbarItem[];
  position: { x: number; y: number };
  target?: HTMLElement;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
};

/**
 * Commands provided by the floating toolbar extension
 */
export type FloatingToolbarCommands = {
  showFloatingToolbar: (config: FloatingToolbarConfig) => void;
  hideFloatingToolbar: () => void;
  updateFloatingToolbar: (config: Partial<FloatingToolbarConfig>) => void;
};

/**
 * State queries provided by the floating toolbar extension
 */
export type FloatingToolbarStateQueries = {
  isFloatingToolbarOpen: () => Promise<boolean>;
};

/**
 * Floating toolbar extension for showing contextual tools.
 * Provides a headless floating toolbar system that appears near selected elements.
 */
export class FloatingToolbarExtension extends BaseExtension<
  'floatingToolbar',
  any,
  FloatingToolbarCommands,
  FloatingToolbarStateQueries,
  React.ReactElement[]
> {
  private toolbarConfig: FloatingToolbarConfig | null = null;
  private listeners: ((config: FloatingToolbarConfig | null) => void)[] = [];

  constructor() {
    super('floatingToolbar', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Listen for selection changes to potentially show/hide floating toolbar
    const unregister = editor.registerUpdateListener(() => {
      // Extensions can use this to show/hide floating toolbars based on selection
    });

    return unregister;
  }

  getCommands(editor: LexicalEditor): FloatingToolbarCommands {
    return {
      showFloatingToolbar: (config: FloatingToolbarConfig) => {
        this.toolbarConfig = config;
        this.notifyListeners(config);
      },
      hideFloatingToolbar: () => {
        this.toolbarConfig = null;
        this.notifyListeners(null);
      },
      updateFloatingToolbar: (config: Partial<FloatingToolbarConfig>) => {
        if (this.toolbarConfig) {
          this.toolbarConfig = { ...this.toolbarConfig, ...config };
          this.notifyListeners(this.toolbarConfig);
        }
      }
    };
  }

  getStateQueries(editor: LexicalEditor): FloatingToolbarStateQueries {
    return {
      isFloatingToolbarOpen: () => Promise.resolve(this.toolbarConfig !== null)
    };
  }

  /**
   * Subscribe to floating toolbar changes
   */
  subscribe(listener: (config: FloatingToolbarConfig | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(config: FloatingToolbarConfig | null) {
    this.listeners.forEach(listener => listener(config));
  }

  getCurrentConfig(): FloatingToolbarConfig | null {
    return this.toolbarConfig;
  }
}

export const floatingToolbarExtension = new FloatingToolbarExtension();
export default floatingToolbarExtension;
