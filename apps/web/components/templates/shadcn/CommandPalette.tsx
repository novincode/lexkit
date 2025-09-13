import React, { useState, useEffect, useRef } from 'react';
import type { CommandPaletteItem } from '@lexkit/editor/extensions/core';
import { Search, Command } from 'lucide-react';
import { Input } from '@repo/ui/components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { Badge } from '@repo/ui/components/badge';

interface ShadcnCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandPaletteItem[];
}

export function ShadcnCommandPalette({ isOpen, onClose, commands }: ShadcnCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    const searchText = `${cmd.label} ${cmd.description || ''} ${cmd.keywords?.join(' ') || ''}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((groups, cmd) => {
    const category = cmd.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(cmd);
    return groups;
  }, {} as Record<string, CommandPaletteItem[]>);

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
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, flatCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader>
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-2">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No commands found
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {commands.map((cmd, cmdIndex) => {
                      const globalIndex = flatCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <div
                          key={cmd.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            cmd.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <Badge variant="secondary" className="ml-2 text-xs font-mono">
                              {cmd.shortcut}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/50">
          <div className="text-xs text-muted-foreground text-center">
            <kbd className="px-1 py-0.5 bg-background rounded text-xs">↑↓</kbd> to navigate,
            <kbd className="px-1 py-0.5 bg-background rounded text-xs ml-1">↵</kbd> to select,
            <kbd className="px-1 py-0.5 bg-background rounded text-xs ml-1">ESC</kbd> to close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
