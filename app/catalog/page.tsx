import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import Link from "next/link";

export default function CatalogPage() {
  const books = [
    {
      id: "1",
      slug: "normal-people",
      title: "Normal People",
      author: "Sally Rooney",
      price: 125000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ",
      badge: "New",
      staggered: false,
    },
    {
      id: "2",
      slug: "norwegian-wood",
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      price: 145000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO",
      badge: "Best Seller",
      staggered: true,
    },
    {
      id: "3",
      slug: "the-secret-history",
      title: "The Secret History",
      author: "Donna Tartt",
      price: 165750,
      originalPrice: 195000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN135f6k9HHk3K_SbJF2SEkOFq7Ln2lCUYPjOOotE1HHra5JXQA2plhokI0adL-M4EaXRkvLAbnCj9st8MX0hS7CTxLA9KbmaankbcrlcrTe3PoWyM6rMDjlaYgKsiXC3dlI7yp34rj7basd497qwnLjk4a1Xrfa7koaGkvGUVyE1ujQy54_35AHhwpLyfV1hDaNffp1YAjYN9PDEmrAXUxDJEsMcTetVqMec9Vt1tm0KtXZP2in1Yq9cBd1pRXx7DZUtOLEsEweCq",
      badge: "Sale",
      staggered: false,
    },
    {
      id: "4",
      slug: "to-the-lighthouse",
      title: "To the Lighthouse",
      author: "Virginia Woolf",
      price: 110000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQv7ds9jqq7B8Fmp6MqcSC7VbSpsfIGtfyw2zbjfQhH_6YTYR_VS3Y6CL_avks9skK_IrFNswjVS0jcbXG1BXob66UW1DZhnD78gr-G4VTsbPxkAkewSvdeXfYzH9y1qZNMQF0cDxdgT9FrGzt6YdTKxxAJc0OT5AMEGgoP1qiFw4F11o0nAkgLH433jx977XZfRqwrnx0Ao-yRfHimvmgl-RrdkZ1dn6vej5fA5p8Cstyp2TriA8u7Mw3h8zIqJNlzfHJ79S0T91",
      staggered: true,
    },
    {
      id: "5",
      slug: "bumi-manusia",
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      price: 135000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUSnJQXi3d6_3bNq-LBgUSrEGktWiDneEG50B-geqUigNw1MBagVxjCKJITMmlKO_ANnfno6Qw3jBSu5XASU2PQGKqewyD1rLHVZdE-uqho8sMhq1ZEUgof7u5jBPl_LX3mcp77dl-RiRZGQMA8OnmtyDR8CkPfzb1Fg0-XnU8GS-Tv66aSvcbTOEdRKV7MJPYRIYiYbFZKKzpOi2U9FlorkJafoiEds3O0NYlLuibzSrUqouwPqrBdJ9EJTJBFCW3c5prL2qs5IZP",
      staggered: false,
    },
    {
      id: "6",
      slug: "cantik-itu-luka",
      title: "Cantik Itu Luka",
      author: "Eka Kurniawan",
      price: 150000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXdtxVvjzntwnPWBLeaFKKgQq6m_ZFSqU3PM-W-mqlXoDshh1kan0FRZoXJMCIOZiK5NEXQLNwKAqiEpaFVvmbSJzmo-0RQpivV5pu9vQTdWU27XIYZa3MDkYKklXPQHpIk5iqmCvsF95h9dCLIJ-iR4HCVQDOUgMNmhTQHtKeqWNZKUuwszivfU6O9_v1rEzhNJgYK9K-mw42NeiayxeGSyAS1XfURwCIFg8DzLLCCTl5E7hYUbFLLO_iUeKqEZ1PxFmwiHtutZ2N",
      badge: "New",
      staggered: true,
    },
  ];

  return (
    <>
      <PublicNavbar />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb & Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant mb-6 uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">Books</span>
          </div>
          
          <div className="border-t-2 border-outline pt-8 pb-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display-lg text-6xl mb-4 text-on-surface tracking-tight">All Books</h1>
              <p className="font-newsreader italic text-xl text-on-surface-variant max-w-xl">
                Browse our complete collection of curated literature.
              </p>
            </div>
            <div className="font-label-sm uppercase tracking-[0.2em] text-xs text-on-surface text-right border-l border-outline-variant/50 pl-6 hidden md:block">
              Total Books<br/>
              <span className="font-newsreader text-2xl italic text-primary">245</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:flex flex-col gap-16 col-span-3">
            {/* Search */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">Search Index</h3>
              <div className="relative border-b border-outline">
                <input type="text" placeholder="Title, Author, or ISBN..." className="w-full bg-transparent py-2 pr-8 font-newsreader italic text-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none transition-colors" />
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] cursor-pointer hover:text-primary transition-colors">search</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">Genres & Collections</h3>
              <div className="flex flex-col gap-4">
                <Link href="#" className="ledger-link active">Contemporary Fiction</Link>
                <Link href="#" className="ledger-link">Classic Literature</Link>
                <Link href="#" className="ledger-link">Non-Fiction & Essays</Link>
                <Link href="#" className="ledger-link">Poetry & Prose</Link>
                <Link href="#" className="ledger-link">Art & Design Theory</Link>
              </div>
            </div>

            {/* Author Filter */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">Curated Authors</h3>
              <div className="flex flex-col gap-4">
                <Link href="#" className="ledger-link">Haruki Murakami</Link>
                <Link href="#" className="ledger-link">Virginia Woolf</Link>
                <Link href="#" className="ledger-link">Pramoedya Ananta Toer</Link>
                <Link href="#" className="ledger-link">Sally Rooney</Link>
                <Link href="#" className="ledger-link">Donna Tartt</Link>
              </div>
              <button className="mt-6 text-[10px] font-label-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">View Full Directory</button>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">Price Range (IDR)</h3>
              <div className="flex items-center gap-4 border-b border-outline pb-2">
                <div className="flex-1">
                  <input type="number" placeholder="Min" className="w-full bg-transparent text-center font-newsreader italic text-lg text-on-surface focus:outline-none transition-colors" />
                </div>
                <span className="text-outline">~</span>
                <div className="flex-1">
                  <input type="number" placeholder="Max" className="w-full bg-transparent text-center font-newsreader italic text-lg text-on-surface focus:outline-none transition-colors" />
                </div>
              </div>
              <button className="w-full mt-6 bg-transparent border border-outline text-outline py-3 font-label-sm uppercase tracking-[0.2em] text-[10px] hover:bg-outline hover:text-white transition-colors">Apply Parameters</button>
            </div>
          </aside>

          {/* Book Grid */}
          <div className="col-span-1 lg:col-span-9 flex flex-col">
            
            {/* Utility Bar */}
            <div className="flex justify-between items-center mb-12">
              <p className="font-newsreader italic text-on-surface-variant hidden md:block">Showing 1-12 of 245 books</p>
              <button className="lg:hidden flex items-center gap-2 border border-outline-variant px-4 py-2 font-label-sm text-xs uppercase tracking-widest hover:bg-surface-variant/30 transition-colors">
                <span className="material-symbols-outlined text-[18px]">tune</span> Filters
              </button>
              <div className="flex items-center gap-3">
                <span className="font-label-sm uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">Sorted By</span>
                <select className="bg-transparent border-b border-outline py-1 pr-6 font-newsreader italic text-lg text-on-surface focus:outline-none appearance-none cursor-pointer">
                  <option>Newest Additions</option>
                  <option>Bestsellers</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-20 gap-x-8">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  slug={book.slug}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  originalPrice={book.originalPrice}
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
                  <span className="font-newsreader text-2xl text-on-surface-variant opacity-50">...</span>
                </li>
                <li>
                  <Link href="#" className="font-newsreader text-2xl text-on-surface-variant hover:text-primary transition-colors">21</Link>
                </li>
                <li>
                  <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                    <span className="material-symbols-outlined font-light text-[24px]">arrow_right_alt</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
