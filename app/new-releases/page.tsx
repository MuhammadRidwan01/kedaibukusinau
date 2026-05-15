import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import Link from "next/link";

export default function NewReleasesPage() {
  const books = [
    {
      id: "1",
      slug: "the-art-of-stillness",
      title: "The Art of Stillness",
      author: "Marcus Thorne",
      price: 140000,
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
    },
    {
      id: "2",
      slug: "beyond-the-horizon",
      title: "Beyond The Horizon",
      author: "Jonathan Pierce",
      price: 145000,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
      staggered: true,
    },
    {
      id: "3",
      slug: "klara-and-the-sun",
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      price: 185000,
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
    },
    {
      id: "4",
      slug: "design-philosophy",
      title: "Design Philosophy",
      author: "Antoine Miller",
      price: 195000,
      imageUrl: "https://images.unsplash.com/photo-1629196914225-83c70624cd8c?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
      staggered: true,
    },
    {
      id: "5",
      slug: "cantik-itu-luka",
      title: "Cantik Itu Luka",
      author: "Eka Kurniawan",
      price: 150000,
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
    },
    {
      id: "6",
      slug: "urban-landscapes",
      title: "Urban Landscapes",
      author: "David Chen",
      price: 195000,
      imageUrl: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
      staggered: true,
    },
    {
      id: "7",
      slug: "the-silent-observer",
      title: "The Silent Observer",
      author: "Clara Woods",
      price: 130000,
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
    },
    {
      id: "8",
      slug: "echoes-of-the-past",
      title: "Echoes of the Past",
      author: "Sarah Jenkins",
      price: 110000,
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      badge: "New" as const,
      staggered: true,
    },
  ];

  return (
    <>
      <PublicNavbar />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">New Releases</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-label-sm uppercase tracking-[0.2em] text-xs text-on-surface-variant mb-4">Fresh off the press</span>
          <h1 className="font-display-lg text-6xl md:text-7xl text-on-surface tracking-tight mb-4">New Arrivals</h1>
          <p className="font-newsreader italic text-xl text-on-surface-variant max-w-xl">
            Browse the newest titles in our store. Handpicked books to inspire your next reading journey.
          </p>
        </div>

        {/* Filter Tab Kategori */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-20">
          <button className="genre-chip !text-primary !border-b-primary font-newsreader text-lg italic bg-transparent border-b border-transparent pb-1 transition-all">All Arrivals</button>
          <button className="genre-chip font-newsreader text-lg italic text-on-surface-variant hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Contemporary Fiction</button>
          <button className="genre-chip font-newsreader text-lg italic text-on-surface-variant hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Non-Fiction</button>
          <button className="genre-chip font-newsreader text-lg italic text-on-surface-variant hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Art & Design</button>
          <button className="genre-chip font-newsreader text-lg italic text-on-surface-variant hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Classic Literature</button>
        </div>

        {/* Utility Bar */}
        <div className="flex justify-between items-center mb-12 border-b border-outline-variant/30 pb-4">
          <p className="font-newsreader italic text-on-surface-variant">Showing 8 recent titles</p>
          <div className="flex items-center gap-3">
            <span className="font-label-sm uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">Sorted By</span>
            <select className="bg-transparent font-newsreader italic text-lg text-on-surface focus:outline-none appearance-none cursor-pointer">
              <option>Date Added (Newest)</option>
              <option>Publication Date</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>

        {/* The Grid (Gallery Layout) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-8">
          {books.map((book) => (
            <BookCard
              key={book.id}
              slug={book.slug}
              title={book.title}
              author={book.author}
              price={book.price}
              imageUrl={book.imageUrl}
              badge={book.badge}
              staggered={book.staggered}
            />
          ))}
        </div>

        {/* Editorial Pagination */}
        <div className="mt-24 pt-12 border-t border-outline-variant/30 flex justify-center">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined font-light text-[24px]">arrow_left_alt</span>
              </Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl italic text-primary border-b border-primary pb-1">1</Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl text-on-surface-variant hover:text-primary transition-colors">2</Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl text-on-surface-variant hover:text-primary transition-colors">3</Link>
            </li>
            <li>
              <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined font-light text-[24px]">arrow_right_alt</span>
              </Link>
            </li>
          </ul>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
