export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-border bg-surface-2/80 backdrop-blur-xl">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              CodeMedic{" "}
              <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="text-xs text-text-muted">
              AI-powered code debugging platform
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-3/60 px-3 py-1.5 text-xs text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Online
        </div>
      </div>
    </header>
  );
}
