"use client";

import { useState, ReactNode } from "react";

interface MobileFilterDrawerProps {
  children: ReactNode;
}

export function MobileFilterDrawer({ children }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 border border-outline-variant px-4 py-2 font-label-sm text-xs uppercase tracking-widest hover:bg-surface-variant/30 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">tune</span> Filters
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[400px] bg-surface border-l border-outline-variant/30 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
              <span className="font-label-sm uppercase tracking-widest text-on-surface">
                Filters
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col gap-12">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
