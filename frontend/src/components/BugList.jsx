const SEVERITY_STYLES = {
  high: "border-severity-high/30 bg-severity-high/10 text-severity-high",
  medium:
    "border-severity-medium/30 bg-severity-medium/10 text-severity-medium",
  low: "border-severity-low/30 bg-severity-low/10 text-severity-low",
};

const SEVERITY_BADGE = {
  high: "bg-severity-high/20 text-severity-high ring-severity-high/30",
  medium:
    "bg-severity-medium/20 text-severity-medium ring-severity-medium/30",
  low: "bg-severity-low/20 text-severity-low ring-severity-low/30",
};

export default function BugList({ bugs }) {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-severity-low/30 bg-severity-low/5 px-5 py-4 animate-fade-in-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-severity-low"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium text-severity-low">
          No bugs detected — your code looks clean!
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bugs.map((bug, index) => {
        const sev = (bug.severity || "medium").toLowerCase();
        return (
          <div
            key={index}
            className={`rounded-xl border p-4 transition-all duration-200 hover:translate-x-1 animate-fade-in-up ${
              SEVERITY_STYLES[sev] || SEVERITY_STYLES.medium
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2.5">
                  {bug.line && (
                    <span className="rounded-md bg-surface-4/80 px-2 py-0.5 font-mono text-xs text-text-secondary">
                      Line {bug.line}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1 ${
                      SEVERITY_BADGE[sev] || SEVERITY_BADGE.medium
                    }`}
                  >
                    {sev}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-text-primary">
                  {bug.issue}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
