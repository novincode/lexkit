import { LexicalEditor, $getSelection, $isRangeSelection } from "lexical";
import { BaseExtension } from "@lexkit/editor/extensions/base";
import { ExtensionCategory } from "@lexkit/editor/extensions/types";
import React from "react";

/**
 * Context menu item configuration
 */
export type ContextMenuItem = {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
};

/**
 * Context menu configuration
 */
export type ContextMenuConfig = {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  target?: HTMLElement;
};

/**
 * Commands provided by the context menu extension
 */
export type ContextMenuCommands = {
  showContextMenu: (config: ContextMenuConfig) => void;
  hideContextMenu: () => void;
};

/**
 * State queries provided by the context menu extension
 */
export type ContextMenuStateQueries = {
  isContextMenuOpen: () => Promise<boolean>;
};

/**
 * Context menu extension for showing contextual actions.
 * Provides a headless context menu system that can be triggered by other extensions.
 */
export class ContextMenuExtension extends BaseExtension<
  "contextMenu",
  any,
  ContextMenuCommands,
  ContextMenuStateQueries,
  React.ReactElement[]
> {
  private contextMenuConfig: ContextMenuConfig | null = null;
  private listeners: ((config: ContextMenuConfig | null) => void)[] = [];

  constructor() {
    super("contextMenu", [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Listen for right-clicks on the editor
    const handleContextMenu = (event: MouseEvent) => {
      // Let other extensions handle specific context menus
      // This is just the base infrastructure
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener("contextmenu", handleContextMenu);
      return () => {
        editorElement.removeEventListener("contextmenu", handleContextMenu);
      };
    }

    return () => {};
  }

  getCommands(editor: LexicalEditor): ContextMenuCommands {
    return {
      showContextMenu: (config: ContextMenuConfig) => {
        this.contextMenuConfig = config;
        this.notifyListeners(config);
      },
      hideContextMenu: () => {
        this.contextMenuConfig = null;
        this.notifyListeners(null);
      },
    };
  }

  getStateQueries(editor: LexicalEditor): ContextMenuStateQueries {
    return {
      isContextMenuOpen: () => Promise.resolve(this.contextMenuConfig !== null),
    };
  }

  /**
   * Subscribe to context menu changes
   */
  subscribe(listener: (config: ContextMenuConfig | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(config: ContextMenuConfig | null) {
    this.listeners.forEach((listener) => listener(config));
  }

  getCurrentConfig(): ContextMenuConfig | null {
    return this.contextMenuConfig;
  }
}

export const contextMenuExtension = new ContextMenuExtension();
export default contextMenuExtension;
