export default function OutputCompare({ originalOutput, fixedOutput }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up">
      {/* Before Fix */}
      <OutputCard
        title="Before Fix"
        data={originalOutput}
        accent="severity-high"
        icon={<ExclamationIcon />}
      />
      {/* After Fix */}
      <OutputCard
        title="After Fix"
        data={fixedOutput}
        accent="severity-low"
        icon={<CheckIcon />}
      />
    </div>
  );
}

function OutputCard({ title, data, accent, icon }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 overflow-hidden">
      <div className={`flex items-center gap-2 border-b border-border bg-${accent}/5 px-4 py-2.5`}>
        {icon}
        <span className={`text-xs font-semibold uppercase tracking-wider text-${accent}`}>
          {title}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {data?.output && (
          <div>
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-text-muted">Output</span>
            <pre className="code-block overflow-x-auto rounded-lg bg-surface/80 p-3 text-text-secondary">{data.output}</pre>
          </div>
        )}
        {data?.error && (
          <div>
            <span className={`mb-1 block text-[11px] font-medium uppercase tracking-widest text-${accent}/70`}>Error</span>
            <pre className={`code-block overflow-x-auto rounded-lg bg-${accent}/5 p-3 text-${accent}/90`}>{data.error}</pre>
          </div>
        )}
        {!data?.output && !data?.error && (
          <p className="text-sm text-text-muted italic">No output</p>
        )}
      </div>
    </div>
  );
}

function ExclamationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-severity-high">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-severity-low">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}
