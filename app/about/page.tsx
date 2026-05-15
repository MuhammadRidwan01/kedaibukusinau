import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="font-label-sm uppercase tracking-[0.2em] text-xs text-on-surface-variant mb-6 block">Our Story</span>
          <h1 className="font-display-lg text-6xl md:text-8xl text-on-surface tracking-tight mb-8">Kedai Sinau.</h1>
          <p className="font-newsreader italic text-2xl md:text-3xl text-on-surface-variant leading-relaxed">
            An independent bookstore. We read, select, and sell good books.
          </p>
        </div>

        {/* Big Image */}
        <div className="w-full relative mb-24 border border-outline-variant/50 p-2 md:p-4 bg-surface shadow-sm">
          <img 
            className="w-full aspect-video md:aspect-[21/9] object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop" 
            alt="Kedai Sinau Bookstore Interior" 
          />
        </div>

        {/* Story / Narasi */}
        <div className="max-w-[700px] mx-auto mb-32 text-lg font-body-md text-on-surface-variant leading-loose space-y-8">
          <p>
            <span className="float-left text-7xl leading-none font-newsreader text-primary mr-4 mt-2">K</span>
            edai Sinau started in 2018 as a small shop in a quiet neighborhood. We wanted to build a physical space where people can easily find books that matter to them, away from the noise of large retail chains.
          </p>
          <p>
            We read and select every title we sell. We focus on contemporary fiction, non-fiction, and poetry that we genuinely believe are worth your time. Our goal is simple: to connect good books with the people who want to read them.
          </p>
        </div>

        {/* Vision & Mission (Museum Plaque style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32 border-t border-b border-outline-variant/50 py-24">
          
          {/* Vision */}
          <div className="flex flex-col">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary mb-6">The Vision</span>
            <h2 className="font-headline-h2 text-4xl mb-6 text-on-surface">A Better Way to Find Books</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-lg">
              To build a space where readers can easily discover high-quality literature and connect with others who share their interests.
            </p>
          </div>
          
          {/* Mission */}
          <div className="flex flex-col">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary mb-6">The Mission</span>
            <ul className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
              <li className="flex gap-4 border-b border-outline-variant/30 pb-4">
                <span className="font-newsreader italic text-xl text-on-surface">01.</span>
                <p>Sell books that are carefully selected for their quality.</p>
              </li>
              <li className="flex gap-4 border-b border-outline-variant/30 pb-4">
                <span className="font-newsreader italic text-xl text-on-surface">02.</span>
                <p>Provide a comfortable and quiet physical space for reading.</p>
              </li>
              <li className="flex gap-4 border-b border-outline-variant/30 pb-4">
                <span className="font-newsreader italic text-xl text-on-surface">03.</span>
                <p>Support local and independent authors.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA to Contact */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <h2 className="font-display-lg text-5xl md:text-6xl text-on-surface mb-6">Visit the Store</h2>
          <p className="font-body-md text-on-surface-variant mb-10 text-lg">
            Looking for a specific book or want to ask us a question? Reach out to us below.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border border-on-surface text-on-surface font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors duration-300">
            Contact Us
            <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
          </Link>
        </div>

      </main>

      <PublicFooter />
    </>
  );
}
