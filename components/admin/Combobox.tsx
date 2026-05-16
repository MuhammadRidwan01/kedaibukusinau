"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ComboboxProps {
  label: string;
  apiEndpoint: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface Item {
  id: number;
  name: string;
  _count?: Record<string, number>;
}

export function Combobox({
  label,
  apiEndpoint,
  value,
  onChange,
  placeholder = "Type to search...",
}: ComboboxProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${apiEndpoint}?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, apiEndpoint]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectItem = useCallback(
    (name: string) => {
      setQuery(name);
      onChange(name);
      setIsOpen(false);
    },
    [onChange]
  );

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
        selectItem(suggestions[activeIndex].name);
      } else {
        onChange(query);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-label-sm uppercase tracking-widest text-on-surface-variant/60 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-outline-variant/50 px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-outline-variant/50 shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectItem(item.name)}
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
          {query && !suggestions.find((s) => s.name.toLowerCase() === query.toLowerCase()) && (
            <button
              type="button"
              onClick={() => selectItem(query)}
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
