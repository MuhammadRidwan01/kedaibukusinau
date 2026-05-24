"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { createArticle, updateArticle } from "@/app/admin/actions/articles";

export function EditorClient({ initialArticle, categories }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [, setSelectionUpdate] = useState(false); // force re-render for toolbar
  const [isDirty, setIsDirty] = useState(false); // track unsaved changes

  const [formData, setFormData] = useState({
    title: initialArticle?.title || "",
    categoryName: initialArticle?.category?.name || "Editorial Essay",
    status: initialArticle?.status || "Draft",
    excerpt: initialArticle?.excerpt || "",
    readTime: initialArticle?.readTime || "",
    imageUrl: initialArticle?.imageUrl || "",
  });

  const extensions = useMemo(() => [
    StarterKit,
    Image.configure({
      inline: true,
    }),
    LinkExtension.configure({
      openOnClick: false,
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Write your story here...',
      emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:text-on-surface-variant/40 before:absolute before:pointer-events-none before:italic',
    }),
  ], []);

  const editor = useEditor({
    extensions,
    content: initialArticle?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-stone max-w-none p-8 md:p-12 font-inter leading-[1.8] outline-none flex-1 min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      setWordCount(words.length);
      setIsDirty(true);
    },
    onSelectionUpdate: () => {
      // Force toolbar re-render when selection changes
      setSelectionUpdate(prev => !prev);
    },
    onTransaction: () => {
      setSelectionUpdate(prev => !prev);
    }
  });

  useEffect(() => {
    if (editor && initialArticle?.content) {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  }, [editor, initialArticle]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/admin/articles");
      }
    } else {
      router.push("/admin/articles");
    }
  };

  const handleFormDataChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
    setIsDirty(true);
  };

  const handleSave = async (status: "Draft" | "Published") => {
    setLoading(true);
    const data = {
      ...formData,
      status,
      content: editor?.getHTML() || "",
    };

    const res = initialArticle
      ? await updateArticle(initialArticle.id, data)
      : await createArticle(data);

    if (res.success) {
      setIsDirty(false); // Clear dirtiness on save
      toast.success(`Article ${status === "Published" ? "published" : "saved as draft"}`);
      router.push("/admin/articles");
    } else {
      toast.error(res.error || "Operation failed");
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const data = new FormData();
    data.append("file", file);
    
    toast.loading("Uploading image...", { id: "upload" });
    try {
      const res = await fetch("/api/upload?type=article", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: json.url });
        toast.success("Image uploaded", { id: "upload" });
      } else {
        toast.error(json.error || "Upload failed", { id: "upload" });
      }
    } catch (err) {
      toast.error("Upload error", { id: "upload" });
    }
  };

  const handleInlineImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const data = new FormData();
      data.append("file", file);
      toast.loading("Uploading image...", { id: "editor-upload" });
      try {
        const res = await fetch("/api/upload?type=article", { method: "POST", body: data });
        const json = await res.json();
        if (res.ok) {
          editor?.chain().focus().setImage({ src: json.url }).run();
          toast.success("Image added", { id: "editor-upload" });
        } else {
          toast.error(json.error || "Upload failed", { id: "editor-upload" });
        }
      } catch (err) {
        toast.error("Upload error", { id: "editor-upload" });
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col -mt-12 lg:-mt-16 -mx-8 lg:-mx-16 h-[calc(100vh)] bg-[#FAF3E0]">
      {/* Top Toolbar */}
      <header className="flex justify-between items-center px-6 lg:px-10 py-6 border-b border-outline-variant/80 shrink-0 bg-[#FAF3E0] sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button onClick={handleBack} className="text-on-surface-variant hover:text-primary transition-colors group flex items-center gap-2 bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-label-sm text-[11px] uppercase tracking-widest hidden md:inline">Back to Articles</span>
          </button>
          <div className="h-6 w-[1px] bg-outline-variant/60 hidden md:block"></div>
          <h2 className="font-headline-h3 text-2xl italic">{initialArticle ? "Edit Article" : "New Article"}</h2>
        </div>

        <div className="flex items-center gap-4">
          <button disabled={loading} onClick={() => handleSave("Draft")} className="border border-outline text-outline font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-white transition-colors disabled:opacity-50">
            Save Draft
          </button>
          <button disabled={loading} onClick={() => handleSave("Published")} className="bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-8 py-2.5 hover:bg-on-surface transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
            Publish
          </button>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1000px] mx-auto px-6 py-12 flex flex-col gap-12">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="col-span-1 flex flex-col gap-3">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Featured Image</span>
              <label className="w-full aspect-[16/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group shadow-sm overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Featured" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">add_photo_alternate</span>
                    <span className="font-newsreader italic text-xs text-on-surface-variant group-hover:text-primary text-center px-4">Upload cinematic thumbnail (16:9)</span>
                  </>
                )}
              </label>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-8 justify-end">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Article Title</label>
                <input required type="text" value={formData.title} onChange={e => handleFormDataChange('title', e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-newsreader font-medium text-2xl text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic transition-all duration-300" placeholder="Enter an engaging headline..." />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <input type="text" value={formData.categoryName} onChange={e => handleFormDataChange('categoryName', e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300" list="categories" />
                  <datalist id="categories">
                    {categories.map((c: any) => <option key={c.id} value={c.name} />)}
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col md:col-span-2">
              <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Excerpt / Summary</label>
              <textarea value={formData.excerpt} onChange={e => handleFormDataChange('excerpt', e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic transition-all duration-300 h-20 resize-none" placeholder="A short summary shown on article cards..."></textarea>
            </div>
            <div className="flex flex-col">
              <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Read Time (min)</label>
              <input type="number" value={formData.readTime} onChange={e => handleFormDataChange('readTime', e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300" placeholder="e.g. 8" min="1" />
            </div>
          </div>

          {/* TipTap Editor */}
          <div className="flex flex-col">
            <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Content</label>
            <div className="border border-outline-variant bg-white flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[500px]">
              
              {/* Toolbar */}
              <div className="border-b border-outline-variant/60 p-3 flex flex-wrap gap-2 bg-[#FAF3E0] sticky top-0 z-10">
                
                {/* Paragraph & Headings */}
                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button onClick={() => editor.chain().focus().setParagraph().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("paragraph") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Paragraph"><span className="font-label-sm text-[12px] uppercase flex items-center justify-center w-5 h-5">P</span></button>
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Heading 2"><span className="font-headline-h2 text-[16px] flex items-center justify-center w-5 h-5">H2</span></button>
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1.5 rounded transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Heading 3"><span className="font-headline-h3 text-[14px] flex items-center justify-center w-5 h-5">H3</span></button>
                </div>
                
                {/* Text Formatting */}
                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("bold") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Bold"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("italic") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Italic"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
                  <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("underline") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Underline"><span className="material-symbols-outlined text-[20px]">format_underlined</span></button>
                  <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("strike") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Strikethrough"><span className="material-symbols-outlined text-[20px]">format_strikethrough</span></button>
                </div>

                {/* Alignment */}
                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Align Left"><span className="material-symbols-outlined text-[20px]">format_align_left</span></button>
                  <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Align Center"><span className="material-symbols-outlined text-[20px]">format_align_center</span></button>
                  <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Align Right"><span className="material-symbols-outlined text-[20px]">format_align_right</span></button>
                  <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'justify' }) ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Justify"><span className="material-symbols-outlined text-[20px]">format_align_justify</span></button>
                </div>

                {/* Lists & Quotes */}
                <div className="flex items-center mr-4 pr-4 border-r border-outline-variant/40 gap-1">
                  <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("blockquote") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Quote"><span className="material-symbols-outlined text-[20px]">format_quote</span></button>
                  <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("bulletList") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Bullet List"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
                  <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive("orderedList") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Numbered List"><span className="material-symbols-outlined text-[20px]">format_list_numbered</span></button>
                </div>

                {/* Links & Media */}
                <div className="flex items-center gap-1">
                  <button onClick={() => {
                    if (editor.isActive("link")) {
                      editor.chain().focus().unsetLink().run();
                    } else {
                      const url = window.prompt("Enter URL:");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }
                  }} className={`p-1.5 rounded transition-colors ${editor.isActive("link") ? "bg-outline-variant/40" : "hover:bg-outline-variant/20"}`} title="Link"><span className="material-symbols-outlined text-[20px]">link</span></button>
                  <button onClick={handleInlineImageUpload} className="p-1.5 rounded transition-colors hover:bg-outline-variant/20" title="Insert Image"><span className="material-symbols-outlined text-[20px]">image</span></button>
                  <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-1.5 rounded transition-colors hover:bg-outline-variant/20" title="Horizontal Line"><span className="material-symbols-outlined text-[20px]">horizontal_rule</span></button>
                </div>

              </div>

              <EditorContent editor={editor} />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="font-newsreader italic text-sm text-on-surface-variant/60">Word count: {wordCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
