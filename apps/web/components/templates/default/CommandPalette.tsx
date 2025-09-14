import React, { useState, useEffect, useRef } from "react";
import type { CommandPaletteItem } from "@lexkit/editor/extensions/core";
import { Search, Command } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandPaletteItem[];
}

export function CommandPalette({
  isOpen,
  onClose,
  commands,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  const filteredCommands = commands.filter((cmd) => {
    const searchText =
      `${cmd.label} ${cmd.description || ""} ${cmd.keywords?.join(" ") || ""}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce(
    (groups, cmd) => {
      const category = cmd.category || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(cmd);
      return groups;
    },
    {} as Record<string, CommandPaletteItem[]>,
  );

  // Flatten for navigation
  const flatCommands = filteredCommands;

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, flatCommands.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="lexkit-command-palette-overlay" onClick={onClose}>
      <div
        className="lexkit-command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lexkit-command-palette-header">
          <Search size={16} className="lexkit-command-palette-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="lexkit-command-palette-input"
          />
          <kbd className="lexkit-command-palette-kbd">ESC</kbd>
        </div>

        <div ref={listRef} className="lexkit-command-palette-list">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="lexkit-command-palette-empty">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="lexkit-command-palette-group">
                <div className="lexkit-command-palette-group-title">
                  {category}
                </div>
                {commands.map((cmd, cmdIndex) => {
                  const globalIndex = flatCommands.indexOf(cmd);
                  return (
                    <div
                      key={cmd.id}
                      className={`lexkit-command-palette-item ${
                        globalIndex === selectedIndex ? "selected" : ""
                      }`}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="lexkit-command-palette-item-content">
                        <div className="lexkit-command-palette-item-title">
                          {cmd.label}
                        </div>
                        {cmd.description && (
                          <div className="lexkit-command-palette-item-description">
                            {cmd.description}
                          </div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className="lexkit-command-palette-item-shortcut">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="lexkit-command-palette-footer">
          <span className="lexkit-command-palette-hint">
            <kbd>↑↓</kbd> to navigate, <kbd>↵</kbd> to select, <kbd>ESC</kbd> to
            close
          </span>
        </div>
      </div>
    </div>
  );
}
