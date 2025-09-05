import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

// Custom Select Component
export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select..."
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="lexkit-select" ref={selectRef}>
      <button
        className={`lexkit-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="lexkit-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              className={`lexkit-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Dropdown Component
export function Dropdown({
  trigger,
  children,
  isOpen,
  onOpenChange
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenChange]);

  return (
    <div className="lexkit-dropdown" ref={dropdownRef}>
      <div onClick={() => onOpenChange(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="lexkit-dropdown-content">
          {children}
        </div>
      )}
    </div>
  );
}
