"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface BookResult {
  id: number;
  slug: string;
  title: string;
  highlightedTitle: string;
  authorName: string | null;
  highlightedAuthor: string;
  imageUrl: string | null;
  synopsis: string | null;
  highlightedSynopsis: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  rank: number;
}

interface SearchResponse {
  books: BookResult[];
  total: number;
  searchMethod: "fulltext" | "fuzzy" | "prefix" | "none";
}

const SUGGESTION_DEBOUNCE_MS = 150;
const SEARCH_DEBOUNCE_MS = 300;

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function SearchResults({ onNavigate, inline, autoFocus }: { onNavigate?: () => void; inline?: boolean; autoFocus?: boolean } = {}) {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Tab suggestion — debounced 150ms
  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      const clearTimer = setTimeout(() => setSuggestion(null), 0);
      return () => clearTimeout(clearTimer);
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Suggestion request failed");

        const data = await res.json();
        setSuggestion(data.suggestion);
      } catch (error) {
        if (isAbortError(error)) return;
        setSuggestion(null);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Search results — debounced 300ms
  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      const clearTimer = setTimeout(() => {
        setResults(null);
        setIsOpen(false);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      let isFetching = true;
      const loadingTimer = setTimeout(() => {
        if (isFetching) setIsLoading(true);
      }, 1000);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}&limit=6`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search request failed");

        const data: SearchResponse = await res.json();
        setResults(data);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (isAbortError(error)) return;
        setResults(null);
      } finally {
        isFetching = false;
        clearTimeout(loadingTimer);
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Tab to complete suggestion
      if (e.key === "Tab" && suggestion && suggestion.toLowerCase().startsWith(query.toLowerCase())) {
        e.preventDefault();
        setQuery(suggestion);
        setSuggestion(null);
        return;
      }

      if (!results?.books.length) return;

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.books.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const book = results.books[activeIndex];
        onNavigate?.();
        window.location.href = `/catalog/${book.slug}`;
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [suggestion, query, results, activeIndex, onNavigate]
  );

  const showGhost =
    suggestion &&
    query &&
    suggestion.toLowerCase().startsWith(query.toLowerCase()) &&
    suggestion.toLowerCase() !== query.toLowerCase();

  return (
    <div ref={containerRef} className="relative">
      {/* Input wrapper */}
      <div className="relative border-b border-outline">
        {/* Ghost text layer */}
        {showGhost && (
          <span className="absolute inset-0 py-2 font-newsreader italic text-lg text-on-surface-variant/25 pointer-events-none select-none whitespace-nowrap overflow-hidden">
            <span className="invisible">{query}</span>
            <span>{suggestion!.slice(query.length)}</span>
          </span>
        )}

        {/* Actual input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results && results.books.length > 0 && setIsOpen(true)}
          placeholder="Title, Author, or ISBN..."
          className="w-full bg-transparent py-2 pr-16 font-newsreader italic text-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none transition-colors relative z-10"
        />

        {/* Icons */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
          {showGhost && (
            <span className="font-label-sm text-[8px] uppercase tracking-widest text-on-surface-variant/40 border border-on-surface-variant/20 px-2 py-0.5 rounded">
              Tab ↹
            </span>
          )}
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-on-surface-variant/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant text-[20px] cursor-pointer hover:text-primary transition-colors">
              search
            </span>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && results && (
        <div className={`${inline ? "mt-2" : "absolute top-full left-0 right-0 mt-2"} bg-surface border border-outline-variant/50 shadow-xl z-50 max-h-[70vh] overflow-y-auto`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/30">
            <span className="font-label-sm uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
              {results.books.length < results.total
                ? `Showing ${results.books.length} of ${results.total} Results`
                : `Search Results (${results.total})`}
            </span>
            {results.searchMethod === "fuzzy" && (
              <span className="ml-3 font-label-sm text-[9px] uppercase tracking-widest text-primary/70">
                Fuzzy Match
              </span>
            )}
          </div>

          {/* Results */}
          {results.books.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-newsreader italic text-on-surface-variant">
                No books found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            results.books.map((book, index) => (
              <Link
                key={book.id}
                href={`/catalog/${book.slug}`}
                className={`block px-6 py-5 border-b border-outline-variant/20 transition-colors duration-200 group ${
                  activeIndex === index
                    ? "bg-surface-variant/30"
                    : "hover:bg-surface-variant/20"
                }`}
                onClick={() => onNavigate?.()}
              >
                <div className="flex gap-5">
                  {/* Cover */}
                  {book.imageUrl && (
                    <div className="flex-shrink-0 w-16">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full aspect-[2/3] object-cover shadow-md"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4
                          className="font-headline-h3 text-lg text-on-surface leading-tight"
                          dangerouslySetInnerHTML={{ __html: book.highlightedTitle }}
                        />
                        <p
                          className="font-newsreader italic text-sm text-on-surface-variant mt-1"
                          dangerouslySetInnerHTML={{ __html: book.highlightedAuthor }}
                        />
                      </div>
                      {book.badge && (
                        <span className="font-label-sm text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 flex-shrink-0">
                          {book.badge}
                        </span>
                      )}
                    </div>

                    {book.highlightedSynopsis && (
                      <p
                        className="font-body-md text-xs text-on-surface-variant/70 mt-2 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: book.highlightedSynopsis }}
                      />
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-label-sm text-sm text-on-surface">
                        Rp {book.price.toLocaleString("id-ID")}
                      </span>
                      <span className="font-label-sm text-[9px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
