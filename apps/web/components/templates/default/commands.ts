import type {
  ExtractCommands,
  BaseCommands,
} from "@lexkit/editor/extensions/types";
import type { CommandPaletteItem } from "@lexkit/editor/extensions/core";

// Import extensions from the template instead of redefining
import { extensions } from "./DefaultTemplate";

// Extract the commands type from our extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;

/**
 * Keyboard shortcut configuration
 */
export type KeyboardShortcut = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
};

/**
 * Command configuration with keyboard shortcuts
 */
export type CommandConfig = {
  id: string;
  label: string;
  description?: string;
  category: string;
  action: (commands: EditorCommands) => void;
  shortcuts?: KeyboardShortcut[];
  keywords?: string[];
  icon?: string;
  condition?: (commands: EditorCommands) => boolean; // Only show if condition is true
};

/**
 * Generate all available commands based on the extensions
 */
export function generateCommands(): CommandConfig[] {
  const commands: CommandConfig[] = [
    // Text Formatting Commands
    {
      id: "format.bold",
      label: "Toggle Bold",
      description: "Make text bold or remove bold formatting",
      category: "Format",
      action: (commands) => commands.toggleBold(),
      shortcuts: [{ key: "b", ctrlKey: true }],
      keywords: ["bold", "strong", "format"],
      icon: "Bold",
    },
    {
      id: "format.italic",
      label: "Toggle Italic",
      description: "Make text italic or remove italic formatting",
      category: "Format",
      action: (commands) => commands.toggleItalic(),
      shortcuts: [{ key: "i", ctrlKey: true }],
      keywords: ["italic", "emphasis", "format"],
      icon: "Italic",
    },
    {
      id: "format.underline",
      label: "Toggle Underline",
      description: "Add or remove underline formatting",
      category: "Format",
      action: (commands) => commands.toggleUnderline(),
      shortcuts: [{ key: "u", ctrlKey: true }],
      keywords: ["underline", "format"],
      icon: "Underline",
    },
    {
      id: "format.strikethrough",
      label: "Toggle Strikethrough",
      description: "Add or remove strikethrough formatting",
      category: "Format",
      action: (commands) => commands.toggleStrikethrough(),
      shortcuts: [{ key: "d", ctrlKey: true, shiftKey: true }],
      keywords: ["strikethrough", "strike", "format"],
      icon: "Strikethrough",
    },
    {
      id: "format.code",
      label: "Toggle Inline Code",
      description: "Format text as inline code",
      category: "Format",
      action: (commands) => commands.formatText("code"),
      shortcuts: [{ key: "`", ctrlKey: true }],
      keywords: ["code", "inline", "format"],
      icon: "Code",
    },

    // Block Formatting Commands
    {
      id: "block.heading1",
      label: "Heading 1",
      description: "Convert to large heading",
      category: "Block",
      action: (commands) => commands.toggleHeading("h1"),
      shortcuts: [{ key: "1", ctrlKey: true, altKey: true }],
      keywords: ["heading", "h1", "title"],
      icon: "Heading1",
    },
    {
      id: "block.heading2",
      label: "Heading 2",
      description: "Convert to medium heading",
      category: "Block",
      action: (commands) => commands.toggleHeading("h2"),
      shortcuts: [{ key: "2", ctrlKey: true, altKey: true }],
      keywords: ["heading", "h2", "subtitle"],
      icon: "Heading2",
    },
    {
      id: "block.heading3",
      label: "Heading 3",
      description: "Convert to small heading",
      category: "Block",
      action: (commands) => commands.toggleHeading("h3"),
      shortcuts: [{ key: "3", ctrlKey: true, altKey: true }],
      keywords: ["heading", "h3"],
      icon: "Heading3",
    },
    {
      id: "block.paragraph",
      label: "Paragraph",
      description: "Convert to paragraph",
      category: "Block",
      action: (commands) => commands.toggleParagraph(),
      shortcuts: [{ key: "0", ctrlKey: true, altKey: true }],
      keywords: ["paragraph", "normal", "text"],
      icon: "Type",
    },
    {
      id: "block.quote",
      label: "Quote",
      description: "Convert to blockquote",
      category: "Block",
      action: (commands) => commands.toggleQuote(),
      shortcuts: [{ key: ">", ctrlKey: true, shiftKey: true }],
      keywords: ["quote", "blockquote", "citation"],
      icon: "Quote",
    },
    {
      id: "block.codeblock",
      label: "Code Block",
      description: "Convert to code block",
      category: "Block",
      action: (commands) => commands.toggleCodeBlock(),
      shortcuts: [{ key: "`", ctrlKey: true, shiftKey: true }],
      keywords: ["code", "block", "programming"],
      icon: "Terminal",
    },

    // List Commands
    {
      id: "list.bullet",
      label: "Bullet List",
      description: "Create or toggle bullet list",
      category: "List",
      action: (commands) => commands.toggleUnorderedList(),
      shortcuts: [{ key: "l", ctrlKey: true, shiftKey: true }],
      keywords: ["list", "bullet", "unordered"],
      icon: "List",
    },
    {
      id: "list.numbered",
      label: "Numbered List",
      description: "Create or toggle numbered list",
      category: "List",
      action: (commands) => commands.toggleOrderedList(),
      shortcuts: [{ key: "l", ctrlKey: true, altKey: true }],
      keywords: ["list", "numbered", "ordered"],
      icon: "ListOrdered",
    },

    // Link Commands
    {
      id: "link.insert",
      label: "Insert Link",
      description: "Insert or edit a link",
      category: "Insert",
      action: (commands) => commands.insertLink(),
      shortcuts: [{ key: "k", ctrlKey: true }],
      keywords: ["link", "url", "hyperlink"],
      icon: "Link",
    },
    {
      id: "link.remove",
      label: "Remove Link",
      description: "Remove link formatting",
      category: "Format",
      action: (commands) => commands.removeLink(),
      shortcuts: [{ key: "k", ctrlKey: true, shiftKey: true }],
      keywords: ["unlink", "remove", "link"],
      icon: "Unlink",
    },

    // Insert Commands
    {
      id: "insert.horizontal-rule",
      label: "Insert Horizontal Rule",
      description: "Insert a horizontal line separator",
      category: "Insert",
      action: (commands) => commands.insertHorizontalRule(),
      shortcuts: [{ key: "-", ctrlKey: true, shiftKey: true }],
      keywords: ["horizontal", "rule", "separator", "line"],
      icon: "Minus",
    },
    {
      id: "insert.image",
      label: "Insert Image",
      description: "Insert an image from URL or file",
      category: "Insert",
      action: (commands) => {
        const src = prompt("Enter image URL:");
        if (src) {
          const alt = prompt("Enter alt text:") || "";
          commands.insertImage({ src, alt });
        }
      },
      shortcuts: [{ key: "i", ctrlKey: true, shiftKey: true }],
      keywords: ["image", "picture", "photo"],
      icon: "Image",
    },

    // Table Commands
    {
      id: "table.insert",
      label: "Insert Table",
      description: "Insert a new table",
      category: "Table",
      action: (commands) =>
        commands.insertTable({ rows: 3, columns: 3, includeHeaders: true }),
      shortcuts: [{ key: "t", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "grid", "data"],
      icon: "Table",
    },
    {
      id: "table.insert-row-above",
      label: "Insert Row Above",
      description: "Insert a new row above current row",
      category: "Table",
      action: (commands) => commands.insertRowAbove(),
      shortcuts: [{ key: "ArrowUp", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "row", "insert", "above"],
      icon: "ArrowUp",
    },
    {
      id: "table.insert-row-below",
      label: "Insert Row Below",
      description: "Insert a new row below current row",
      category: "Table",
      action: (commands) => commands.insertRowBelow(),
      shortcuts: [{ key: "ArrowDown", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "row", "insert", "below"],
      icon: "ArrowDown",
    },
    {
      id: "table.insert-column-left",
      label: "Insert Column Left",
      description: "Insert a new column to the left",
      category: "Table",
      action: (commands) => commands.insertColumnLeft(),
      shortcuts: [{ key: "ArrowLeft", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "column", "insert", "left"],
      icon: "ArrowLeft",
    },
    {
      id: "table.insert-column-right",
      label: "Insert Column Right",
      description: "Insert a new column to the right",
      category: "Table",
      action: (commands) => commands.insertColumnRight(),
      shortcuts: [{ key: "ArrowRight", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "column", "insert", "right"],
      icon: "ArrowRight",
    },
    {
      id: "table.delete-row",
      label: "Delete Row",
      description: "Delete the current table row",
      category: "Table",
      action: (commands) => commands.deleteRow(),
      shortcuts: [{ key: "Backspace", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "row", "delete", "remove"],
      icon: "Trash",
    },
    {
      id: "table.delete-column",
      label: "Delete Column",
      description: "Delete the current table column",
      category: "Table",
      action: (commands) => commands.deleteColumn(),
      shortcuts: [{ key: "Delete", ctrlKey: true, shiftKey: true }],
      keywords: ["table", "column", "delete", "remove"],
      icon: "Trash",
    },

    // History Commands
    {
      id: "edit.undo",
      label: "Undo",
      description: "Undo the last action",
      category: "Edit",
      action: (commands) => commands.undo(),
      shortcuts: [{ key: "z", ctrlKey: true }],
      keywords: ["undo", "revert"],
      icon: "Undo",
    },
    {
      id: "edit.redo",
      label: "Redo",
      description: "Redo the last undone action",
      category: "Edit",
      action: (commands) => commands.redo(),
      shortcuts: [
        { key: "y", ctrlKey: true },
        { key: "z", ctrlKey: true, shiftKey: true },
      ],
      keywords: ["redo", "repeat"],
      icon: "Redo",
    },

    // Command Palette
    {
      id: "palette.show",
      label: "Show Command Palette",
      description: "Open the command palette",
      category: "View",
      action: (commands) => commands.showCommandPalette(),
      shortcuts: [{ key: "p", ctrlKey: true, shiftKey: true }],
      keywords: ["command", "palette", "search"],
      icon: "Search",
    },
  ];

  return commands;
}

/**
 * Convert our commands to command palette items
 */
export function commandsToCommandPaletteItems(
  commands: EditorCommands,
): CommandPaletteItem[] {
  return generateCommands().map((cmd) => ({
    id: cmd.id,
    label: cmd.label,
    description: cmd.description,
    category: cmd.category,
    action: () => cmd.action(commands),
    keywords: cmd.keywords,
    shortcut: cmd.shortcuts?.[0] ? formatShortcut(cmd.shortcuts[0]) : undefined,
  }));
}

/**
 * Format keyboard shortcut for display
 */
function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  if (shortcut.ctrlKey) parts.push("Ctrl");
  if (shortcut.metaKey) parts.push("Cmd");
  if (shortcut.altKey) parts.push("Alt");
  if (shortcut.shiftKey) parts.push("Shift");
  parts.push(shortcut.key.toUpperCase());
  return parts.join("+");
}

/**
 * Register keyboard shortcuts
 */
export function registerKeyboardShortcuts(
  commands: EditorCommands,
  element: HTMLElement = document.body,
): () => void {
  const commandConfigs = generateCommands();

  const handleKeyDown = (event: KeyboardEvent) => {
    for (const config of commandConfigs) {
      if (!config.shortcuts) continue;

      for (const shortcut of config.shortcuts) {
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.metaKey === !!shortcut.metaKey &&
          !!event.shiftKey === !!shortcut.shiftKey &&
          !!event.altKey === !!shortcut.altKey
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }

          // Check condition if exists
          if (config.condition && !config.condition(commands)) {
            continue;
          }

          config.action(commands);
          return;
        }
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}
