import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import CodeInput from "./components/CodeInput";
import ResultPanel from "./components/ResultPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (code) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        code,
        language: "python",
      });
      setResult(response.data);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Code Input */}
        <section className="mb-8">
          <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 py-12 animate-pulse-glow">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-surface-4" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin-slow" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-accent">Analyzing your code…</p>
              <p className="mt-1 text-xs text-text-muted">
                Running AI analysis and code execution
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-2xl border border-severity-high/30 bg-severity-high/5 p-5 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 flex-shrink-0 text-severity-high">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-severity-high">Analysis Failed</p>
                <p className="mt-1 text-sm text-text-secondary">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && <ResultPanel result={result} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        CodeMedic AI · Built with FastAPI & React
      </footer>
    </div>
  );
}
