// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useAuth } from "../../../hooks/usAuth";
// import { API_ROUTES } from "@/config";
// import { AnalysisInsight } from "@/types/project.type";

// export default function ProjectAnalysisPage() {
//   const router = useRouter();
//   const { projectId } = useParams<{ projectId: string }>();
//   const { token } = useAuth();

//   const [analysis, setAnalysis] = useState<AnalysisInsight[] | null>(null);
//   const [status, setStatus] = useState<"pending" | "complete" | string>("");
//   const [rerunning, setRerunning] = useState(false);
//   const [rerunStatus, setRerunStatus] = useState("");
//   const pollingRef = useRef<NodeJS.Timeout | null>(null);  

//   // Fetch project details (includes status + analysisSummary)
//   const fetchAnalysis = async () => {
//     if (!token) return;
//     try {
//       const res = await fetch(API_ROUTES.PROJECT_DETAILS(projectId), {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch project");
//       const json = await res.json();
//       setAnalysis(json.project.analysisSummary);
//       setStatus(json.project.status);
//     } catch (err) {
//       console.error("Fetch analysis error:", err);
//     }
//   };

//   // Handle Rerun button
//   const handleRerun = async () => {
//     if (!token) return;
//     setRerunning(true);
//     setRerunStatus("Re-running analysis...");
//     try {
//       const res = await fetch(API_ROUTES.RERUN(projectId), {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRerunStatus(res.ok ? "Analysis started!" : "Failed to start.");
//       if (res.ok) {
//         // reset status to pending and clear previous results
//         setStatus("pending");
//         setAnalysis(null);
//       }
//     } catch {
//       setRerunStatus("Something went wrong.");
//     } finally {
//       setRerunning(false);
//     }
//   };

//   // 1️⃣ Initial load
//   useEffect(() => {
//     fetchAnalysis();
//   }, [projectId, token]);

//   // 2️⃣ Poll every 5s while status is pending
//   useEffect(() => {
//     if (status === "pending") {
//       pollingRef.current = setInterval(fetchAnalysis, 5000);
//     } else {
//       clearInterval(pollingRef.current as NodeJS.Timeout);
//     }
//     return () => clearInterval(pollingRef.current as NodeJS.Timeout);
//   }, [status]);

//   return (
//     <div className="p-6 mt-10 space-y-6">
//       <button
//         className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition"
//         onClick={() => router.back()}
//       >
//         ← Back
//       </button>

//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Project Analysis</h1>
//         <button
//           onClick={handleRerun}
//           disabled={rerunning}
//           className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
//         >
//           🔄 Rerun
//         </button>
//       </div>

//       {rerunStatus && (
//         <p className="text-sm text-gray-400">{rerunStatus}</p>
//       )}

//       {/* Loader until first insight arrives */}
//       {!analysis && status === "pending" && (
//         <div className="flex flex-col items-center py-12">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-400">Preparing analysis…</p>
//         </div>
//       )}

//       {/* Display insights as soon as they’re present */}
//       {analysis && (
//         <>
//           {analysis.map((insight, idx) => (
//             <div
//               key={idx}
//               className="mb-8 bg-[#1a1a2e]/70 backdrop-blur-md p-6 rounded-xl shadow-lg"
//             >
//               <h2 className="text-xl font-semibold text-blue-400 mb-4">
//                 Route: {insight.route}
//               </h2>
//               {insight.performanceData.map((metrics, i) => (
//                 <div
//                   key={i}
//                   className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
//                 >
//                   {Object.entries(metrics).map(([key, detail]) => (
//                     <div
//                       key={key}
//                       className="bg-[#111827] p-4 rounded-lg border border-gray-700"
//                     >
//                       <h3 className="text-lg font-medium text-purple-300">
//                         {key}
//                       </h3>
//                       <p className="text-sm text-gray-300">
//                         Value:{" "}
//                         <span className="font-semibold text-white">
//                           {detail.value}
//                         </span>
//                       </p>
//                       <p className="mt-2 text-sm text-gray-400">
//                         Recommended Steps:
//                       </p>
//                       <ul className="list-disc list-inside text-sm text-gray-500">
//                         {detail.recommendedSteps.map(
//                           (step: string, j: number) => (
//                             <li key={j}>{step}</li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}

//           {/* Show a small spinner if still pending after some insights */}
//           {status === "pending" && (
//             <div className="flex justify-center py-4">
//               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}
//         </>
//       )}

//       {/* If analysis exists but status is complete and empty */}
//       {analysis && analysis.length === 0 && status === "complete" && (
//         <p className="text-gray-400">No routes found for analysis.</p>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../hooks/usAuth";
import { API_ROUTES } from "@/config";
import { AnalysisInsight } from "@/types/project.type";

export default function ProjectAnalysisPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();

  const [analysis, setAnalysis] = useState<AnalysisInsight[] | null>(null);
  const [status, setStatus] = useState<"pending" | "complete" | string>("");
  const [rerunning, setRerunning] = useState(false);
  const [rerunStatus, setRerunStatus] = useState("");

  // 1️⃣ Initial load of existing data
  useEffect(() => {
    if (!token) return;
    fetch(API_ROUTES.PROJECT_DETAILS(projectId), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then(({ project }) => {
        setAnalysis(project.analysisSummary);
        setStatus(project.status);
      })
      .catch(console.error);
  }, [projectId, token]);

  // 2️⃣ Handle Rerun click
  const handleRerun = async () => {
    if (!token) return;
    setRerunning(true);
    setRerunStatus("Re-running analysis...");
    try {
      const res = await fetch(API_ROUTES.RERUN(projectId), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to start");
      setRerunStatus("Analysis started!");
      setStatus("pending");
      setAnalysis(null);
    } catch {
      setRerunStatus("Something went wrong.");
    } finally {
      setRerunning(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const streamUrl = `${API_ROUTES.PROJECT_STREAM(projectId)}?token=${encodeURIComponent(
      token
    )}`;
    const es = new EventSource(streamUrl);

    es.addEventListener("analysisUpdate", (e) => {
      try {
        const payload = JSON.parse((e as MessageEvent).data) as AnalysisInsight & {
          route: string;
          performanceData: any;
        };
        setAnalysis((prev) => (prev ? [...prev, payload] : [payload]));
        // We still mark as pending until worker sets status to complete
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    });

    es.addEventListener("complete", () => {
      setStatus("complete");
      es.close();
    });

    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [projectId, token]);

  return (
    <div className="p-6 mt-10 space-y-6">
      <button
        className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Analysis</h1>
        <button
          onClick={handleRerun}
          disabled={rerunning}
          className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
        >
          🔄 Rerun
        </button>
      </div>

      {rerunStatus && <p className="text-sm text-gray-400">{rerunStatus}</p>}

      {/* Loader until first insight arrives */}
      {!analysis && status === "pending" && (
        <div className="flex flex-col items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Preparing analysis…</p>
        </div>
      )}

      {/* Display insights as soon as they arrive */}
      {analysis && analysis.length > 0 && (
        <>
          {analysis.map((insight, idx) => (
            <div
              key={`${insight.route}-${idx}`}
              className="mb-8 bg-[#1a1a2e]/70 backdrop-blur-md p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                Route: {insight.route}
              </h2>
              {insight.performanceData.map((metrics, i) => (
                <div
                  key={i}
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
                          {(detail as any).value}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Recommended Steps:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        {(detail as any).recommendedSteps.map(
                          (step: string, j: number) => (
                            <li key={j}>{step}</li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Spinner if still pending after some insights */}
          {status === "pending" && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      )}

      {/* No routes case */}
      {analysis && analysis.length === 0 && status === "complete" && (
        <p className="text-gray-400">No routes found for analysis.</p>
      )}
    </div>
  );
}

