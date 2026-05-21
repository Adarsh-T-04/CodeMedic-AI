import BugList from "./BugList";
import OutputCompare from "./OutputCompare";

export default function ResultPanel({ result }) {
  if (!result) return null;

  const { bugs, explanation, quality_score, fixed_code, original_output, fixed_output } = result;

  const scoreColor =
    quality_score >= 80 ? "text-severity-low" :
    quality_score >= 50 ? "text-severity-medium" : "text-severity-high";

  const strokeColor =
    quality_score >= 80 ? "#22c55e" :
    quality_score >= 50 ? "#f59e0b" : "#ef4444";

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (quality_score / 100) * circumference;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Quality Score ───────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface-2/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          {/* SVG Ring */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#2e3148" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="45"
                fill="none"
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="animate-score-fill"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{quality_score}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Score</span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-text-primary">Quality Score</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {quality_score >= 80 ? "Great code quality! Minor or no issues found." :
               quality_score >= 50 ? "Decent code with some issues to address." :
               "Code needs significant improvements."}
            </p>
            {bugs && bugs.length > 0 && (
              <p className="mt-2 text-xs text-text-muted">
                {bugs.length} bug{bugs.length !== 1 ? "s" : ""} detected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bugs ────────────────────────────────────── */}
      <Section title="Bugs Found" count={bugs?.length || 0}>
        <BugList bugs={bugs} />
      </Section>

      {/* ── Explanation ─────────────────────────────── */}
      {explanation && (
        <Section title="Explanation">
          <p className="text-sm leading-relaxed text-text-secondary">{explanation}</p>
        </Section>
      )}

      {/* ── Fixed Code ──────────────────────────────── */}
      {fixed_code && (
        <Section title="Fixed Code" copyable={fixed_code}>
          <pre className="code-block overflow-x-auto rounded-xl bg-surface/80 p-5 text-text-secondary border border-border/50">
            {fixed_code}
          </pre>
        </Section>
      )}

      {/* ── Execution Comparison ────────────────────── */}
      <Section title="Execution Comparison">
        <OutputCompare originalOutput={original_output} fixedOutput={fixed_output} />
      </Section>
    </div>
  );
}

function Section({ title, count, copyable, children }) {
  const handleCopy = () => {
    if (copyable) {
      navigator.clipboard.writeText(copyable);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-2/60 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {title}
          {typeof count === "number" && (
            <span className="rounded-full bg-surface-4 px-2 py-0.5 text-xs font-bold text-text-secondary">
              {count}
            </span>
          )}
        </h3>
        {copyable && (
          <button
            onClick={handleCopy}
            className="rounded-lg border border-border bg-surface-3 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-4 hover:text-text-primary"
          >
            Copy
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
