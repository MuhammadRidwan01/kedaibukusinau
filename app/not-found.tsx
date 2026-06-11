import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-on-surface relative overflow-hidden flex items-center">
      <div className="noise-overlay absolute inset-0 pointer-events-none z-50"></div>
      
      {/* Abstract Background Elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-on-surface/5 blur-3xl pointer-events-none z-0"></div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        {/* Left: Huge Typographic 404 */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start lg:items-end">
           <h1 className="font-headline-h1 text-[10rem] sm:text-[14rem] md:text-[20rem] lg:text-[24rem] leading-[0.8] tracking-tighter text-on-surface opacity-95 select-none relative">
             <span className="absolute -top-12 -left-12 opacity-20">
               <svg viewBox="0 0 100 100" fill="none" className="w-32 h-32 md:w-48 md:h-48 text-on-surface stroke-current animate-[spin_60s_linear_infinite]">
                 <circle cx="50" cy="50" r="48" strokeWidth="0.5" strokeDasharray="4 8" />
                 <path d="M50 0 L50 100 M0 50 L100 50" strokeWidth="0.5" />
               </svg>
             </span>
             40<span className="italic font-light">4</span>
           </h1>
        </div>

        {/* Right: Content and Interaction */}
        <div className="lg:col-span-5 flex flex-col items-start gap-8 border-l-[0.5px] border-on-surface/30 pl-8 lg:pl-16 py-12 relative">
          <div className="absolute -left-[5px] top-0 w-[10px] h-[1px] bg-on-surface"></div>
          <div className="absolute -left-[5px] bottom-0 w-[10px] h-[1px] bg-on-surface"></div>

          <span className="font-newsreader uppercase tracking-[0.4em] text-[10px] text-on-surface-variant flex items-center gap-4">
            <span className="w-4 h-4 border rounded-full border-on-surface/50 flex items-center justify-center">
              <span className="w-1 h-1 bg-on-surface rounded-full"></span>
            </span>
            Null / Void
          </span>
          
          <h2 className="font-headline-h1 text-4xl md:text-5xl leading-[1.1] tracking-tight">
            The page has vanished.
          </h2>
          
          <p className="font-body-md text-on-surface-variant max-w-sm leading-relaxed text-sm md:text-base">
            What you seek is no longer within our archives. It might have been moved, deleted, or perhaps it never existed at all.
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center gap-6 mt-8"
          >
            <span className="w-16 h-[1px] bg-on-surface transition-all duration-500 group-hover:w-28 group-hover:bg-primary"></span>
            <span className="font-newsreader uppercase tracking-[0.2em] text-[11px] transition-transform duration-500 group-hover:translate-x-2 group-hover:text-primary">
              Return to Index
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
