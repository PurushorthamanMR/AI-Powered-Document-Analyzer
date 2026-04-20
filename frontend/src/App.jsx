import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";
import { analyzeDocument } from "./lib/api";

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async ({ file, text }) => {
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const data = await analyzeDocument({ file, text });
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong while analyzing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">AI-Powered Document Analyzer</h1>
          <p className="text-sm text-slate-600 md:text-base">
            Upload a PDF or paste text to generate a summary, key points, and action items.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
          <ResultPanel result={result} isLoading={isLoading} />
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
      </div>
    </main>
  );
}

export default App;
