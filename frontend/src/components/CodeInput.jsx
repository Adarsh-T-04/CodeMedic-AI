import { useState } from "react";

export default function CodeInput({ onAnalyze, isLoading }) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code.trim()) return;
    onAnalyze(code);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    // Tab inserts spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      setCode(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-2/60 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-severity-high/70" />
            <span className="h-3 w-3 rounded-full bg-severity-medium/70" />
            <span className="h-3 w-3 rounded-full bg-severity-low/70" />
          </div>
          <span className="ml-2 text-xs font-medium text-text-muted">
            main.py
          </span>
        </div>

        <span className="text-[11px] text-text-muted">
          ⌘ + Enter to analyze
        </span>
      </div>

      {/* Editor area */}
      <div className="relative">
        {/* Line numbers gutter */}
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-12 flex-col items-end border-r border-border/50 pr-2 pt-5 text-xs leading-[1.6] text-text-muted font-mono">
          {code.split("\n").map((_, i) => (
            <span key={i} className="h-[1.6em]">
              {i + 1}
            </span>
          ))}
          {code === "" && <span className="h-[1.6em]">1</span>}
        </div>

        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your Python code here..."
          spellCheck={false}
          className="code-block min-h-[320px] w-full resize-y bg-transparent py-5 pl-16 pr-5 text-text-primary placeholder-text-muted/50 outline-none"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <p className="text-xs text-text-muted">
          {code.split("\n").length} lines · {code.length} chars
        </p>

        <button
          id="analyze-btn"
          onClick={handleSubmit}
          disabled={isLoading || !code.trim()}
          className="group relative overflow-hidden rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-accent/20"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin-slow h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Analyzing…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Analyze Code
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
