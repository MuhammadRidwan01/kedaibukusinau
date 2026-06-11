import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface relative">
      <div className="noise-overlay"></div>
      <div className="flex flex-col items-center gap-8 relative z-10">
        <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">
          Page Not Found
        </span>
        <h1 className="font-headline-h1 text-6xl sm:text-8xl md:text-[12rem] tracking-tighter leading-none text-on-surface">
          404
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-md text-center leading-relaxed">
          The page you're looking for has been moved, removed, or never existed
          in our collection.
        </p>
        <div className="w-12 h-[1px] bg-primary"></div>
        <Link
          href="/"
          className="border border-on-surface text-on-surface px-10 py-4 font-newsreader uppercase text-xs tracking-widest hover:bg-on-surface hover:text-white transition-colors duration-500"
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
