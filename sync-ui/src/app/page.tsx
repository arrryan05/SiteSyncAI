"use client";
import { useState } from "react";

export default function Home() {
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim()) return;
    console.log(website);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analysis/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ website }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze website");
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          SiteSync AI
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter website URL..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Analyze
            </button>
          </div>
        </form>

        {/* Output Window */}
        {/* Output Window */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg min-h-[200px] flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-blue-400">
            Analysis Results
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center text-gray-400 animate-pulse">
              Analyzing website...
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : response?.analysis ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {response.analysis}
            </div>
          ) : (
            <div className="text-gray-500">No analysis yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
