"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../hooks/usAuth";
import { API_ROUTES } from "@/config";
import { AnalysisInsight, RerunResponse } from "@/types/project.type";

export default function ProjectAnalysisPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisInsight[] | null>(null);
  const [rerunning, setRerunning] = useState(false);
  const [rerunStatus, setRerunStatus] = useState("");

  const fetchAnalysis = async () => {
    if (!token) return;
    const res = await fetch(API_ROUTES.PROJECT_DETAILS(projectId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setAnalysis(json.project.analysisSummary);
  };

  const handleRerun = async () => {
    if (!token) return;
    setRerunning(true);
    setRerunStatus("Re-running analysis...");

    try {
      const res = await fetch(API_ROUTES.RERUN(projectId), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRerunStatus("Analysis started! Refresh later to see results.");
      } else {
        setRerunStatus("Failed to start analysis.");
      }
    } catch (err) {
      console.error("Rerun error:", err);
      setRerunStatus("Something went wrong.");
    } finally {
      setRerunning(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [projectId, token]);

  return (
    <div className="p-6 mt-10">
      <button
        className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-2xl font-bold">Project Analysis</h1>
        <button
          onClick={handleRerun}
          disabled={rerunning}
          title="Rerun Analysis"
          className="px-4 py-2 border border-blue-400 text-whit e-400 rounded-full hover:bg-gray-800 transition"
        >
          🔄 Rerun
        </button>
      </div>

      {rerunStatus && (
        <p className="text-sm text-gray-400 mb-4">{rerunStatus}</p>
      )}

      {!analysis ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        analysis.map((insight, index) => (
          <div
            key={index}
            className="mb-8 bg-[#1a1a2e] p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              Route: {insight.route}
            </h2>
            {insight.performanceData.map((metrics, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                {Object.entries(metrics).map(([key, detail]) => (
                  <div
                    key={key}
                    className="bg-[#111827] p-4 rounded-lg border border-gray-700"
                  >
                    <h3 className="text-lg font-medium text-purple-300">
                      {key}
                    </h3>
                    <p className="text-sm text-gray-300">
                      Value:{" "}
                      <span className="font-semibold text-white">
                        {detail.value}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Recommended Steps:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      {detail.recommendedSteps.map(
                        (step: string, i: number) => (
                          <li key={i}>{step}</li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
