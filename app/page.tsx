import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BookCard } from "@/components/ui/BookCard";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <PublicNavbar />
      <HeroCarousel />

      <section className="max-w-[1200px] mx-auto w-full px-6 pt-16 pb-20">
        <div className="flex flex-col gap-12">
          <div className="flex justify-between items-baseline border-b border-outline-variant pb-4">
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Curated Collection
            </h2>
            <Link
              className="font-newsreader uppercase tracking-widest text-xs text-primary hover:opacity-80 transition-opacity border-b border-primary/30 pb-1"
              href="/catalog"
            >
              View Catalog
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            <BookCard
              slug="whispers-in-the-wind"
              title="Whispers in the Wind"
              author="Elena Rossi"
              price={125000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCXdtxVvjzntwnPWBLeaFKKgQq6m_ZFSqU3PM-W-mqlXoDshh1kan0FRZoXJMCIOZiK5NEXQLNwKAqiEpaFVvmbSJzmo-0RQpivV5pu9vQTdWU27XIYZa3MDkYKklXPQHpIk5iqmCvsF95h9dCLIJ-iR4HCVQDOUgMNmhTQHtKeqWNZKUuwszivfU6O9_v1rEzhNJgYK9K-mw42NeiayxeGSyAS1XfURwCIFg8DzLLCCTl5E7hYUbFLLO_iUeKqEZ1PxFmwiHtutZ2N"
              badge="Best Seller"
            />
            <BookCard
              slug="the-art-of-stillness"
              title="The Art of Stillness"
              author="Marcus Thorne"
              price={140000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ"
              badge="New"
              staggered
            />
            <BookCard
              slug="echoes-of-the-past"
              title="Echoes of the Past"
              author="Sarah Jenkins"
              price={110000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO"
            />
            <BookCard
              slug="urban-landscapes"
              title="Urban Landscapes"
              author="David Chen"
              price={155000}
              originalPrice={195000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBpQv7ds9jqq7B8Fmp6MqcSC7VbSpsfIGtfyw2zbjfQhH_6YTYR_VS3Y6CL_avks9skK_IrFNswjVS0jcbXG1BXob66UW1DZhnD78gr-G4VTsbPxkAkewSvdeXfYzH9y1qZNMQF0cDxdgT9FrGzt6YdTKxxAJc0OT5AMEGgoP1qiFw4F11o0nAkgLH433jx977XZfRqwrnx0Ao-yRfHimvmgl-RrdkZ1dn6vej5fA5p8Cstyp2TriA8u7Mw3h8zIqJNlzfHJ79S0T91"
              badge="Sale"
              staggered
            />
            <BookCard
              slug="the-silent-observer"
              title="The Silent Observer"
              author="Clara Woods"
              price={130000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCN135f6k9HHk3K_SbJF2SEkOFq7Ln2lCUYPjOOotE1HHra5JXQA2plhokI0adL-M4EaXRkvLAbnCj9st8MX0hS7CTxLA9KbmaankbcrlcrTe3PoWyM6rMDjlaYgKsiXC3dlI7yp34rj7basd497qwnLjk4a1Xrfa7koaGkvGUVyE1ujQy54_35AHhwpLyfV1hDaNffp1YAjYN9PDEmrAXUxDJEsMcTetVqMec9Vt1tm0KtXZP2in1Yq9cBd1pRXx7DZUtOLEsEweCq"
            />
            <BookCard
              slug="design-philosophy"
              title="Design Philosophy"
              author="Antoine Miller"
              price={195000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDUSnJQXi3d6_3bNq-LBgUSrEGktWiDneEG50B-geqUigNw1MBagVxjCKJITMmlKO_ANnfno6Qw3jBSu5XASU2PQGKqewyD1rLHVZdE-uqho8sMhq1ZEUgof7u5jBPl_LX3mcp77dl-RiRZGQMA8OnmtyDR8CkPfzb1Fg0-XnU8GS-Tv66aSvcbTOEdRKV7MJPYRIYiYbFZKKzpOi2U9FlorkJafoiEds3O0NYlLuibzSrUqouwPqrBdJ9EJTJBFCW3c5prL2qs5IZP"
              badge="Best Seller"
              staggered
            />
            <BookCard
              slug="beyond-the-horizon"
              title="Beyond The Horizon"
              author="Jonathan Pierce"
              price={145000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO"
              badge="New"
            />
            <BookCard
              slug="modern-architecture"
              title="Modern Architecture"
              author="Sarah Jenkins"
              price={175000}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ"
              staggered
            />
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-4 border border-outline text-on-surface font-newsreader uppercase tracking-widest text-sm px-12 py-5 hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-500 group"
            >
              Explore Full Collection
              <span className="material-symbols-outlined font-light text-base transform group-hover:translate-x-2 transition-transform duration-500">
                east
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Avant-Garde Bestseller */}
      <section className="w-full bg-[#1E3A5F] text-[#FAF3E0] py-32 md:py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.03] z-0">
          <h2 className="font-headline-h1 text-[15rem] md:text-[25rem] whitespace-nowrap leading-none tracking-tighter">
            BESTSELLER
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
            <div className="md:col-span-5 flex justify-center mt-8 md:mt-0">
              <div className="relative group cursor-pointer w-[85%] md:w-[80%]">
                <div className="absolute -top-10 -left-10 w-20 h-20 border-t-[4px] border-l-[4px] border-[#FAF3E0]/80 transition-all duration-700 group-hover:-top-14 group-hover:-left-14 z-0"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-[4px] border-r-[4px] border-[#FAF3E0]/80 transition-all duration-700 group-hover:-bottom-14 group-hover:-right-14 z-0"></div>

                <div className="relative z-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] transform transition-transform duration-700 group-hover:scale-[1.03]">
                  <img
                    alt="The Midnight Library"
                    className="w-full aspect-[2/3] object-cover editorial-inner filter contrast-125"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUSnJQXi3d6_3bNq-LBgUSrEGktWiDneEG50B-geqUigNw1MBagVxjCKJITMmlKO_ANnfno6Qw3jBSu5XASU2PQGKqewyD1rLHVZdE-uqho8sMhq1ZEUgof7u5jBPl_LX3mcp77dl-RiRZGQMA8OnmtyDR8CkPfzb1Fg0-XnU8GS-Tv66aSvcbTOEdRKV7MJPYRIYiYbFZKKzpOi2U9FlorkJafoiEds3O0NYlLuibzSrUqouwPqrBdJ9EJTJBFCW3c5prL2qs5IZP"
                  />

                  <div className="absolute top-12 -right-8 bg-primary text-white font-label-sm text-[10px] tracking-widest uppercase px-6 py-2 rotate-90 origin-bottom-right shadow-xl">
                    No. 1 Bestseller
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7 flex flex-col pt-8 md:pt-0">
              <div className="flex items-center gap-6 mb-8">
                <span className="w-12 h-[1px] bg-[#FAF3E0]/30"></span>
                <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-[#FAF3E0]/60">
                  Bestseller of the Month
                </span>
                <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-primary">
                  05 . 24
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-10">
                <h3 className="font-headline-h1 text-5xl md:text-7xl tracking-tight leading-[1.1] mb-2">
                  The Midnight
                  <br />
                  <i className="text-[#FAF3E0]/70 font-light">Library</i>
                </h3>
                <span className="font-newsreader italic text-2xl text-[#FAF3E0]/50">
                  Matt Haig
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-[#FAF3E0]/20 py-8 mb-10">
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Genre
                  </span>
                  <span className="font-newsreader text-sm tracking-wide">
                    Contemporary Fiction
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Pages
                  </span>
                  <span className="font-newsreader text-sm tracking-wide">
                    304 p.
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-3 pt-4 border-t border-[#FAF3E0]/10">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Synopsis
                  </span>
                  <p className="font-body-md text-sm leading-loose text-[#FAF3E0]/70 text-justify">
                    Between life and death there is a library, and within that
                    library, the shelves go on forever. Every book provides a
                    chance to try another life you could have lived. To see how
                    things would be if you had made other choices.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-baseline justify-between gap-8">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40 mb-2">
                    Edition Price
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-headline-h3 text-lg text-[#FAF3E0]/40 line-through">
                      Rp 210.000
                    </span>
                    <span className="font-label-sm text-[10px] tracking-widest uppercase bg-primary/90 text-white px-3 py-1">
                      -21%
                    </span>
                  </div>
                  <div className="font-headline-h3 text-3xl mt-1">Rp 165.000</div>
                </div>
                <Link
                  href="/catalog/the-midnight-library"
                  className="w-full text-center md:w-auto bg-[#FAF3E0] text-[#1E3A5F] font-newsreader uppercase tracking-widest text-xs px-10 py-5 hover:bg-primary hover:text-white transition-all duration-500"
                >
                  Acquire Book
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Ledger: New Arrivals */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-5 flex flex-col gap-6 border-t border-outline-variant pt-6">
            <span className="font-newsreader uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Fresh off the press
            </span>
            <h2 className="font-display-lg text-6xl md:text-7xl text-on-surface leading-none tracking-tight">
              New
              <br />
              <i className="text-on-surface-variant font-light">Arrivals</i>
            </h2>
            <p className="font-body-md text-on-surface-variant mt-4 md:pr-12 leading-relaxed">
              Discover our latest acquisitions. A curated index of titles that
              challenge the mind and soothe the soul, presented without visual
              noise.
            </p>
          </div>

          <div className="md:col-span-7 flex flex-col border-t border-outline-variant pt-6">
            <div className="-mx-4 md:-mx-8 flex flex-col">
              {[
                {
                  id: "01",
                  title: "Klara and the Sun",
                  author: "Kazuo Ishiguro",
                  price: 185000,
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXdtxVvjzntwnPWBLeaFKKgQq6m_ZFSqU3PM-W-mqlXoDshh1kan0FRZoXJMCIOZiK5NEXQLNwKAqiEpaFVvmbSJzmo-0RQpivV5pu9vQTdWU27XIYZa3MDkYKklXPQHpIk5iqmCvsF95h9dCLIJ-iR4HCVQDOUgMNmhTQHtKeqWNZKUuwszivfU6O9_v1rEzhNJgYK9K-mw42NeiayxeGSyAS1XfURwCIFg8DzLLCCTl5E7hYUbFLLO_iUeKqEZ1PxFmwiHtutZ2N",
                  desc: "A thrilling and profound novel from the Nobel Prize winner, asking what it means to love in a changing world.",
                  slug: "klara-and-the-sun",
                },
                {
                  id: "02",
                  title: "Normal People",
                  author: "Sally Rooney",
                  price: 150000,
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ",
                  desc: "A captivating exploration of modern relationships and coming of age in the 21st century.",
                  slug: "normal-people",
                },
                {
                  id: "03",
                  title: "The Secret History",
                  author: "Donna Tartt",
                  price: 210000,
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO",
                  desc: "A modern classic combining brilliant character studies with a gripping murder mystery.",
                  slug: "the-secret-history",
                },
                {
                  id: "04",
                  title: "A Little Life",
                  author: "Hanya Yanagihara",
                  price: 250000,
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQv7ds9jqq7B8Fmp6MqcSC7VbSpsfIGtfyw2zbjfQhH_6YTYR_VS3Y6CL_avks9skK_IrFNswjVS0jcbXG1BXob66UW1DZhnD78gr-G4VTsbPxkAkewSvdeXfYzH9y1qZNMQF0cDxdgT9FrGzt6YdTKxxAJc0OT5AMEGgoP1qiFw4F11o0nAkgLH433jx977XZfRqwrnx0Ao-yRfHimvmgl-RrdkZ1dn6vej5fA5p8Cstyp2TriA8u7Mw3h8zIqJNlzfHJ79S0T91",
                  desc: "A beautifully written, intensely moving narrative of four friends in New York City.",
                  slug: "a-little-life",
                },
              ].map((item, index) => (
                <div
                  key={item.id}
                  className={`group ${
                    index === 0
                      ? "border-b border-outline-variant/30 bg-white shadow-sm hover:[&_.grid]:grid-rows-[1fr] hover:[&_.grid]:opacity-100"
                      : "border-b border-outline-variant/30 cursor-pointer hover:bg-white hover:shadow-sm"
                  } px-4 md:px-8 transition-all duration-500`}
                >
                  <div
                    className={`flex items-center justify-between py-6 transition-colors duration-500 ${
                      index === 0
                        ? "text-primary"
                        : "group-hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-6 md:gap-12 w-full">
                      <span
                        className={`font-newsreader text-sm ${
                          index === 0
                            ? "opacity-100"
                            : "text-on-surface-variant opacity-50 group-hover:text-primary transition-colors duration-500"
                        }`}
                      >
                        {item.id}
                      </span>
                      <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                        <h3
                          className={`font-headline-h3 text-2xl ${
                            index === 0
                              ? ""
                              : "text-on-surface group-hover:text-primary transition-colors duration-500"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <span
                          className={`font-newsreader italic ${
                            index === 0
                              ? "opacity-80"
                              : "text-on-surface-variant transition-colors duration-500"
                          }`}
                        >
                          {item.author}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <span
                        className={`font-label-sm text-sm hidden md:block ${
                          index === 0
                            ? "text-primary"
                            : "text-on-surface-variant group-hover:text-primary transition-colors"
                        }`}
                      >
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`material-symbols-outlined transform transition-transform duration-500 ${
                          index === 0
                            ? "rotate-180"
                            : "group-hover:rotate-180 text-on-surface-variant group-hover:text-primary"
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div
                    className={`grid opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      index === 0
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] group-hover:grid-rows-[1fr] group-hover:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pt-2 flex flex-col md:flex-row gap-6 md:gap-8 ml-0 md:ml-[4.5rem]">
                        <img
                          alt={item.title}
                          className="w-full md:w-32 aspect-[2/3] object-cover shadow-xl editorial-inner"
                          src={item.img}
                        />
                        <div className="flex flex-col justify-end">
                          <p className="font-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
                            {item.desc}
                          </p>
                          <Link
                            href={`/catalog/${item.slug}`}
                            className="border border-on-surface text-on-surface px-6 py-3 font-newsreader uppercase text-xs tracking-widest hover:bg-on-surface hover:text-white transition-colors w-fit"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genre Browser */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="font-headline-h1 uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Browse by
            </span>
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Explore Genres
            </h2>
            <div className="w-12 h-[1px] bg-primary mt-2"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-[800px] mx-auto">
            {[
              "Fiction",
              "Non-Fiction",
              "Self-Help",
              "Romance",
              "Business",
              "Biography",
              "Science",
              "Children's",
              "History",
              "Psychology",
            ].map((genre) => (
              <button key={genre} className="genre-chip">
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="font-headline-h1 uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Readers Say
            </span>
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Testimonials
            </h2>
            <div className="w-12 h-[1px] bg-primary mt-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <p className="font-headline-h1 text-lg italic text-on-surface leading-relaxed pt-8">
                Koleksi bukunya sangat berkualitas. Setiap rekomendasi selalu
                tepat sasaran dan pengiriman sangat cepat!
              </p>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                  ★★★★★
                </div>
                <div className="font-label-sm text-label-sm text-on-surface">
                  Aisyah Putri
                </div>
                <div className="font-caption text-caption text-on-surface-variant">
                  Jakarta
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="font-headline-h1 text-lg italic text-on-surface leading-relaxed pt-8">
                Toko buku favorit saya! Pelayanan ramah dan selalu ada
                buku-buku yang sulit ditemukan di tempat lain.
              </p>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                  ★★★★★
                </div>
                <div className="font-label-sm text-label-sm text-on-surface">
                  Rizky Pratama
                </div>
                <div className="font-caption text-caption text-on-surface-variant">
                  Bandung
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="font-headline-h1 text-lg italic text-on-surface leading-relaxed pt-8">
                Senang bisa menemukan toko buku dengan kurasi yang bagus. Buku
                selalu dalam kondisi perfect.
              </p>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                  ★★★★★
                </div>
                <div className="font-label-sm text-label-sm text-on-surface">
                  Dewi Lestari
                </div>
                <div className="font-caption text-caption text-on-surface-variant">
                  Surabaya
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="w-full theme-dark py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          <div className="flex justify-between items-baseline border-b border-outline-variant pb-4">
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Literary Journal
            </h2>
            <Link
              className="font-newsreader uppercase tracking-widest text-xs text-primary hover:opacity-80 transition-opacity border-b border-primary/30 pb-1"
              href="/journal"
            >
              Read All Entries
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                date: "October 12, 2024",
                title: "The Resurgence of Print: Why Physical Books Endure",
                desc: "Exploring the tactile pleasure of paper and ink in an increasingly digital world, and why the physical object matters more than ever.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTAfoLSLK6gliayaPI1sAYPmgfuCo4Spdmymp5o1cIlxmzx_Cj65JR5PbIrQbKdsG4Xs_yq9TCWE6O6JsB-XgVqPI48e_6dDQ_whpQy0KXatfoFS_4drIMR9qtMuPAFA150wJaeFsorMtlID09Ta_vb3XDhpVKKpDI35EU6LctRQz_Ehj_ZIUIHoEslgJuVMbEW-cij3Rq_wK45nW8QgwPVgot1TKuFTWoTz7HCyb0L4UWxvX0b5PvjmP1ZnKOd0OFurffgo_LSwD7",
                slug: "resurgence-of-print",
              },
              {
                date: "October 05, 2024",
                title: "Curating Your Personal Library",
                desc: "Tips and philosophies for building a collection that reflects your intellectual journey and aesthetic sensibilities.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN135f6k9HHk3K_SbJF2SEkOFq7Ln2lCUYPjOOotE1HHra5JXQA2plhokI0adL-M4EaXRkvLAbnCj9st8MX0hS7CTxLA9KbmaankbcrlcrTe3PoWyM6rMDjlaYgKsiXC3dlI7yp34rj7basd497qwnLjk4a1Xrfa7koaGkvGUVyE1ujQy54_35AHhwpLyfV1hDaNffp1YAjYN9PDEmrAXUxDJEsMcTetVqMec9Vt1tm0KtXZP2in1Yq9cBd1pRXx7DZUtOLEsEweCq",
                slug: "curating-personal-library",
                className: "md:mt-12",
              },
              {
                date: "September 28, 2024",
                title: "Hidden Gems of 20th Century Fiction",
                desc: "A look back at underrated masterpieces that deserve a prominent place on your bedside table.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKPD5ZlPPPGZq6ofsro3-LBqVErv52t7RhAW-xhb__m-_op0q2moVnyDEFt2MTGDqjTzJDj8hvavnNRK1P-gcZZUAzhG6D4BUhp441A0GRrSAsIluCsDmTi6PyhiadEg2fpY7m2jqHBQwHm6SII9Pwz2A9YYq4HlPiWOY22cToqesxpV2p-Qy2mRJKzr1fTLJEjTmiwb9B64EVdBeWtuAEoOQvLwL461RxOElWxlreg3RHiXLDzmRc1Fr4FA_e41FGX_-QU5uXBNY5",
                slug: "hidden-gems-20th-century",
              },
            ].map((article) => (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className={`flex flex-col group cursor-pointer ${
                  article.className || ""
                }`}
              >
                <div className="overflow-hidden border border-outline-variant bg-white p-2 mb-6">
                  <img
                    alt="Article Image"
                    className="w-full h-64 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                    src={article.img}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-newsreader italic text-sm text-on-surface-variant">
                    {article.date}
                  </span>
                  <h3 className="font-headline-h3 text-2xl text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-outline-variant"></div>
                  <p className="font-body-md text-on-surface-variant line-clamp-3">
                    {article.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
