"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MultiComboboxProps {
  label: string;
  apiEndpoint: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

interface Item {
  id: number;
  name: string;
  _count?: Record<string, number>;
}

export function MultiCombobox({
  label,
  apiEndpoint,
  value,
  onChange,
  placeholder = "Type to search...",
}: MultiComboboxProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const separator = apiEndpoint.includes("?") ? "&" : "?";
        const res = await fetch(`${apiEndpoint}${separator}q=${encodeURIComponent(query)}`);
        const data = await res.json();
        // Filter out already selected items from suggestions
        const filteredData = data.filter((item: Item) => !value.includes(item.name));
        setSuggestions(filteredData);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, apiEndpoint, value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      
      // Prevent duplicates
      if (!value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onChange, value]
  );

  const handleRemove = (nameToRemove: string) => {
    onChange(value.filter(name => name !== nameToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex].name);
      } else if (query.trim()) {
        handleSelect(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Backspace" && query === "" && value.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col">
      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tagName) => (
          <span 
            key={tagName} 
            className="flex items-center gap-1 bg-surface-variant/40 border border-outline-variant/30 px-3 py-1 text-xs font-inter text-on-surface rounded-full group transition-colors hover:bg-surface-variant/60"
          >
            {tagName}
            <button 
              type="button" 
              onClick={() => handleRemove(tagName)}
              className="text-on-surface-variant opacity-50 group-hover:opacity-100 hover:text-primary focus:outline-none transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.length > 0) setIsOpen(true);
        }}
        placeholder={value.length === 0 ? placeholder : "Add more..."}
        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-0 focus:border-primary transition-colors font-inter"
      />

      {isOpen && (suggestions.length > 0 || query.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#FAF3E0] border border-outline-variant/30 shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.name)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                activeIndex === index
                  ? "bg-surface-variant/30 text-primary"
                  : "text-on-surface hover:bg-surface-variant/20"
              }`}
            >
              <span className="font-medium">{item.name}</span>
              {item._count && (
                <span className="ml-2 text-xs text-on-surface-variant/50">
                  ({Object.values(item._count)[0]} books)
                </span>
              )}
            </button>
          ))}
          {query && !suggestions.find((s) => s.name.toLowerCase() === query.toLowerCase()) && !value.find(v => v.toLowerCase() === query.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleSelect(query)}
              className="w-full text-left px-4 py-3 text-sm text-primary border-t border-outline-variant/30 hover:bg-surface-variant/20 transition-colors"
            >
              + Create &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
