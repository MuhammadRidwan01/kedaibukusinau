"use client";

import { useState, useEffect, useRef } from "react";
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

const SEARCH_DEBOUNCE_MS = 300;

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function MobileSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Slight delay to allow animation to finish before initializing the modal.
    const initializationTimer = setTimeout(() => {
      inputRef.current?.focus();

      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {}
      }
    }, 100);

    return () => clearTimeout(initializationTimer);
  }, []);

  const saveSearchClick = (q: string) => {
    if (!q.trim()) return;
    const updated = [q.trim(), ...recentSearches.filter((s) => s !== q.trim())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Search results — debounced 300ms
  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      const clearTimer = setTimeout(() => {
        setResults(null);
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
          `/api/search?q=${encodeURIComponent(normalizedQuery)}&limit=10`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search request failed");

        const data: SearchResponse = await res.json();
        setResults(data);
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

  return (
    <div className="fixed inset-0 z-[100] w-full min-h-screen bg-background flex flex-col lg:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
      
      {/* Avant-Garde Header */}
      <header className="flex flex-col px-6 pt-6 pb-4 border-b border-outline-variant/30 bg-background/95 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <span className="font-label-sm text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/60">
            Index Search
          </span>
          <button 
            onClick={onClose} 
            aria-label="Close search" 
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">
              Close
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface group-hover:text-primary transition-transform duration-300 group-hover:rotate-90">
              close
            </span>
          </button>
        </div>
        
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined text-[24px] text-on-surface/60 absolute left-0 font-light">
            search
          </span>
          <input
            ref={inputRef}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-newsreader italic text-3xl md:text-4xl text-on-surface placeholder-on-surface/45 pl-10 pr-10 py-2 caret-primary"
            placeholder="Title, author, keyword..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.length >= 2) {
                saveSearchClick(query);
              }
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              aria-label="Clear search" 
              className="absolute right-0 p-2 text-on-surface/60 hover:text-primary transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px] font-light">backspace</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
        {query.length >= 2 ? (
          <div className="px-6 py-8">
            {isLoading ? (
               <div className="flex justify-center py-16">
                 <span className="w-8 h-8 border-[1px] border-on-surface/10 border-t-primary rounded-full animate-spin" />
               </div>
            ) : results?.books.length === 0 ? (
               <div className="text-center py-16 text-on-surface-variant flex flex-col items-center gap-4">
                 <span className="material-symbols-outlined text-[48px] font-light opacity-20">search_off</span>
                 <p className="font-newsreader italic text-xl">No manuscripts found for &ldquo;{query}&rdquo;</p>
               </div>
            ) : (
               <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <div className="flex items-center gap-4 mb-8">
                   <span className="h-px bg-outline-variant/50 flex-1"></span>
                   <span className="font-label-sm uppercase tracking-[0.2em] text-[9px] text-on-surface-variant/60">
                     {results && results.books.length < results.total
                       ? `Showing ${results.books.length} of ${results.total} Results`
                       : `${results?.total || 0} Results Found`}
                   </span>
                   <span className="h-px bg-outline-variant/50 flex-1"></span>
                 </div>
                 
                 {results?.books.map((book, index) => (
                   <Link
                     key={book.id}
                     href={`/catalog/${book.slug}`}
                     className="group block mb-6 last:mb-0"
                     onClick={() => {
                       saveSearchClick(query);
                       onClose();
                     }}
                   >
                     <div className="flex gap-6 items-center p-3 -mx-3 rounded-lg hover:bg-surface-variant/30 transition-colors duration-300">
                       {/* Cover */}
                       {book.imageUrl ? (
                         <div className="flex-shrink-0 w-16 md:w-20 relative">
                           <div className="aspect-[2/3] relative shadow-lg overflow-hidden editorial-inner">
                             <img
                               src={book.imageUrl}
                               alt={book.title}
                               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             />
                           </div>
                         </div>
                       ) : (
                         <div className="flex-shrink-0 w-16 md:w-20 aspect-[2/3] bg-surface-variant/50 flex items-center justify-center editorial-inner">
                           <span className="material-symbols-outlined text-on-surface/20">book</span>
                         </div>
                       )}
                       
                       {/* Info */}
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <span className="font-label-sm text-[8px] uppercase tracking-widest text-primary/70 mb-1">
                           {String(index + 1).padStart(2, '0')}
                         </span>
                         <h4
                           className="font-headline-h3 text-lg md:text-xl text-on-surface leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                           dangerouslySetInnerHTML={{ __html: book.highlightedTitle }}
                         />
                         <p
                           className="font-newsreader italic text-sm md:text-base text-on-surface-variant mt-1"
                           dangerouslySetInnerHTML={{ __html: book.highlightedAuthor }}
                         />
                         <div className="flex items-center justify-between mt-3">
                           <span className="font-label-sm text-[11px] tracking-wider text-on-surface">
                             IDR {book.price.toLocaleString("id-ID")}
                           </span>
                           <span className="material-symbols-outlined text-[16px] text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                             arrow_forward
                           </span>
                         </div>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section className="px-6 py-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                    Recent Inquiries
                  </span>
                  <div className="h-px bg-outline-variant/40 flex-1"></div>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-4 py-2 border border-outline-variant/60 bg-transparent text-on-surface font-label-sm text-[10px] uppercase tracking-wider hover:bg-on-surface hover:text-white transition-all duration-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
