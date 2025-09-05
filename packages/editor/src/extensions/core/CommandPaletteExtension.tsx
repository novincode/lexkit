import { LexicalEditor } from 'lexical';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import React from 'react';

/**
 * Command palette item
 */
export type CommandPaletteItem = {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  keywords?: string[];
  category?: string;
  icon?: React.ReactNode;
  shortcut?: string;
};

/**
 * Commands provided by the command palette extension
 */
export type CommandPaletteCommands = {
  showCommandPalette: () => void;
  hideCommandPalette: () => void;
  registerCommand: (item: CommandPaletteItem) => void;
  unregisterCommand: (id: string) => void;
};

/**
 * State queries provided by the command palette extension
 */
export type CommandPaletteStateQueries = {
  isCommandPaletteOpen: () => Promise<boolean>;
};

/**
 * Command palette extension for quick access to all editor commands.
 * Provides a searchable command palette similar to VS Code.
 */
export class CommandPaletteExtension extends BaseExtension<
  'commandPalette',
  any,
  CommandPaletteCommands,
  CommandPaletteStateQueries,
  React.ReactElement[]
> {
  private isOpen = false;
  private commands: Map<string, CommandPaletteItem> = new Map();
  private listeners: ((isOpen: boolean, commands: CommandPaletteItem[]) => void)[] = [];

  constructor() {
    super('commandPalette', [ExtensionCategory.Toolbar]);
  }

  register(editor: LexicalEditor): () => void {
    // Register keyboard shortcut (Cmd/Ctrl + Shift + P)
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        this.toggleCommandPalette();
      }
      
      // ESC to close
      if (event.key === 'Escape' && this.isOpen) {
        this.hideCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Register default table commands if table extension is available
    this.registerTableCommands(editor);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }

  getCommands(editor: LexicalEditor): CommandPaletteCommands {
    return {
      showCommandPalette: () => this.showCommandPalette(),
      hideCommandPalette: () => this.hideCommandPalette(),
      registerCommand: (item: CommandPaletteItem) => this.registerCommand(item),
      unregisterCommand: (id: string) => this.unregisterCommand(id)
    };
  }

  getStateQueries(editor: LexicalEditor): CommandPaletteStateQueries {
    return {
      isCommandPaletteOpen: () => Promise.resolve(this.isOpen)
    };
  }

  private showCommandPalette() {
    this.isOpen = true;
    this.notifyListeners();
  }

  private hideCommandPalette() {
    this.isOpen = false;
    this.notifyListeners();
  }

  private toggleCommandPalette() {
    this.isOpen = !this.isOpen;
    this.notifyListeners();
  }

  private registerCommand(item: CommandPaletteItem) {
    this.commands.set(item.id, item);
    this.notifyListeners();
  }

  private unregisterCommand(id: string) {
    this.commands.delete(id);
    this.notifyListeners();
  }

  private registerTableCommands(editor: LexicalEditor) {
    // These would be registered automatically when table extension is loaded
    const tableCommands: CommandPaletteItem[] = [
      {
        id: 'table.insertRowAbove',
        label: 'Insert Row Above',
        category: 'Table',
        action: () => {
          // This would call the table extension's command
          console.log('Insert row above');
        },
        keywords: ['table', 'row', 'insert', 'above']
      },
      {
        id: 'table.insertRowBelow',
        label: 'Insert Row Below',
        category: 'Table',
        action: () => {
          console.log('Insert row below');
        },
        keywords: ['table', 'row', 'insert', 'below']
      },
      {
        id: 'table.insertColumnLeft',
        label: 'Insert Column Left',
        category: 'Table',
        action: () => {
          console.log('Insert column left');
        },
        keywords: ['table', 'column', 'insert', 'left']
      },
      {
        id: 'table.insertColumnRight',
        label: 'Insert Column Right',
        category: 'Table',
        action: () => {
          console.log('Insert column right');
        },
        keywords: ['table', 'column', 'insert', 'right']
      },
      {
        id: 'table.deleteRow',
        label: 'Delete Row',
        category: 'Table',
        action: () => {
          console.log('Delete row');
        },
        keywords: ['table', 'row', 'delete', 'remove']
      },
      {
        id: 'table.deleteColumn',
        label: 'Delete Column',
        category: 'Table',
        action: () => {
          console.log('Delete column');
        },
        keywords: ['table', 'column', 'delete', 'remove']
      }
    ];

    tableCommands.forEach(cmd => this.registerCommand(cmd));
  }

  private notifyListeners() {
    const commandsArray = Array.from(this.commands.values());
    this.listeners.forEach(listener => listener(this.isOpen, commandsArray));
  }

  /**
   * Subscribe to command palette changes
   */
  subscribe(listener: (isOpen: boolean, commands: CommandPaletteItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getAllCommands(): CommandPaletteItem[] {
    return Array.from(this.commands.values());
  }
}

export const commandPaletteExtension = new CommandPaletteExtension();
export default commandPaletteExtension;
