import { useState } from "react";

function InputPanel({ onAnalyze, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");

  const hasInput = Boolean(selectedFile || text.trim());

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasInput || isLoading) {
      return;
    }

    onAnalyze({
      file: selectedFile,
      text,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="pdfUpload">
          Upload PDF
        </label>
        <input
          id="pdfUpload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
        />
        {selectedFile ? (
          <p className="mt-2 text-xs text-slate-500">Selected: {selectedFile.name}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="rawText">
          Or paste text
        </label>
        <textarea
          id="rawText"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste text here if you do not want to upload a PDF..."
          className="min-h-40 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!hasInput || isLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Scanning Document...
          </>
        ) : (
          "Analyze Document"
        )}
      </button>

      {isLoading ? (
        <div className="space-y-2" aria-live="polite">
          <p className="text-xs font-medium text-slate-600">Extracting text and generating insights...</p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="scan-progress h-full w-1/3 rounded-full bg-slate-800" />
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default InputPanel;
