function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, emptyText }) {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function formatProviderName(provider) {
  const value = String(provider || "").toLowerCase();
  if (value === "openai") return "OpenAI";
  if (value === "gemini") return "Gemini";
  if (value === "claude") return "Claude";
  return "Unknown";
}

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Scanning...</h2>
        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">AI Processing</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="scan-progress h-full w-1/3 rounded-full bg-blue-600" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-11/12 rounded bg-slate-200 skeleton-pulse" />
        <div className="h-3 w-4/5 rounded bg-slate-200 skeleton-pulse" />
        <div className="h-3 w-10/12 rounded bg-slate-200 skeleton-pulse" />
        <div className="h-3 w-3/4 rounded bg-slate-200 skeleton-pulse" />
      </div>
      <p className="mt-5 text-xs text-slate-500">Reading document, extracting context, and preparing output...</p>
    </div>
  );
}

function ResultPanel({ result, isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Analysis results will appear here after you submit text or a PDF.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-indigo-700 uppercase">Used Provider</p>
        <p className="mt-1 text-sm font-semibold text-indigo-900">{formatProviderName(result.aiProvider)}</p>
      </section>

      <SectionCard title="Summary">
        <p className="text-sm leading-6 text-slate-700">{result.summary || "No summary available."}</p>
      </SectionCard>

      <SectionCard title="Key Points">
        <BulletList items={result.keyPoints} emptyText="No key points available." />
      </SectionCard>

      <SectionCard title="Action Items">
        <BulletList items={result.actionItems} emptyText="No action items available." />
      </SectionCard>
    </div>
  );
}

export default ResultPanel;
