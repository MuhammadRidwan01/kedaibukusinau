export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="noise-overlay"></div>
      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="w-8 h-8 border-t-2 border-r-2 border-primary rounded-full animate-spin"></div>
        <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">
          Loading
        </span>
      </div>
    </div>
  );
}
