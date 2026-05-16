"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

export default function ArticleEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col -mt-12 lg:-mt-16 -mx-8 lg:-mx-16 h-[calc(100vh)] bg-[#FAF3E0]">
      {/* Top Toolbar */}
      <header className="flex justify-between items-center px-6 lg:px-10 py-6 border-b border-outline-variant/80 shrink-0 bg-[#FAF3E0] sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/articles"
            className="text-on-surface-variant hover:text-primary transition-colors group flex items-center gap-2"
          >
            <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-label-sm text-[11px] uppercase tracking-widest hidden md:inline">
              Back to Articles
            </span>
          </Link>
          <div className="h-6 w-[1px] bg-outline-variant/60 hidden md:block"></div>
          <h2 className="font-headline-h3 text-2xl italic">Article Editor</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline hidden md:block">
            Preview
          </button>
          <button className="border border-outline text-outline font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-white transition-colors">
            Save Draft
          </button>
          <button className="bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-8 py-2.5 hover:bg-on-surface transition-colors shadow-lg shadow-primary/20">
            Publish
          </button>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1000px] mx-auto px-6 py-12 flex flex-col gap-12">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Thumbnail */}
            <div className="col-span-1 flex flex-col gap-3">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                Featured Image
              </span>
              <div className="w-full aspect-[16/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group shadow-sm">
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                  add_photo_alternate
                </span>
                <span className="font-newsreader italic text-xs text-on-surface-variant group-hover:text-primary text-center px-4">
                  Upload cinematic thumbnail (16:9)
                </span>
              </div>
            </div>

            {/* Title & Category */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-8 justify-end">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-newsreader font-medium text-2xl text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="Enter an engaging headline..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    Category
                  </label>
                  <select className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 appearance-none rounded-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%231E3A5F%22><path%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22M19%209l-7%207-7-7%22/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1em]">
                    <option>Featured</option>
                    <option>Interview</option>
                    <option>Book Review</option>
                    <option>Editorial Essay</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end pb-3">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="text-primary focus:ring-primary border-outline-variant rounded-sm"
                    />
                    <span className="font-newsreader italic text-sm text-on-surface group-hover:text-primary transition-colors">
                      Visible to Public
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt & Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col md:col-span-2">
              <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                Excerpt / Summary
              </label>
              <textarea
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300 h-20 resize-none"
                placeholder="A short summary shown on article cards in the Journal listing. Max ~160 characters recommended."
              ></textarea>
              <span className="font-newsreader text-[11px] italic text-on-surface-variant mt-1 opacity-70">
                Displayed as preview text on the Journal page. If empty, first
                paragraph will be used.
              </span>
            </div>
            <div className="flex flex-col">
              <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                Read Time (min)
              </label>
              <input
                type="number"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                placeholder="e.g. 8"
                min="1"
              />
              <span className="font-newsreader text-[11px] italic text-on-surface-variant mt-1 opacity-70">
                Auto-estimated from word count if left empty.
              </span>
            </div>
          </div>

          {/* Rich Text Editor Section */}
          <div className="flex flex-col">
            <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Content
            </label>
            <div className="border border-outline-variant bg-white flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[500px]">
              {/* Toolbar */}
              <div className="border-b border-outline-variant/60 p-3 flex flex-wrap gap-2 bg-[#FAF3E0] sticky top-0 z-10">
                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button
                    type="button"
                    onClick={() => handleCommand("formatBlock", "P")}
                    title="Paragraph"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="font-label-sm text-[12px] uppercase flex items-center justify-center w-5 h-5">
                      P
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("formatBlock", "H2")}
                    title="Heading 2"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="font-headline-h2 text-[16px] flex items-center justify-center w-5 h-5">
                      H2
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("formatBlock", "H3")}
                    title="Heading 3"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="font-headline-h3 text-[14px] flex items-center justify-center w-5 h-5">
                      H3
                    </span>
                  </button>
                </div>

                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button
                    type="button"
                    onClick={() => handleCommand("bold")}
                    title="Bold"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_bold
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("italic")}
                    title="Italic"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_italic
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("underline")}
                    title="Underline"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_underlined
                    </span>
                  </button>
                </div>

                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button
                    type="button"
                    onClick={() => handleCommand("formatBlock", "BLOCKQUOTE")}
                    title="Blockquote"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_quote
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("insertUnorderedList")}
                    title="Bullet List"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("insertOrderedList")}
                    title="Numbered List"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      format_list_numbered
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Insert Link"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      link
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Insert Image"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      image
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand("insertHorizontalRule")}
                    title="Horizontal Rule"
                    className="p-1.5 text-on-surface-variant hover:bg-outline-variant/20 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      horizontal_rule
                    </span>
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div
                ref={editorRef}
                className="p-8 md:p-12 font-inter text-[16px] leading-[1.8] outline-none flex-1"
                contentEditable
                onInput={handleInput}
              >
                <p>
                  <br />
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="font-newsreader italic text-sm text-on-surface-variant/60">
                Word count: {wordCount}
              </span>
              <span className="font-newsreader italic text-sm text-primary">
                Last saved: Just now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
