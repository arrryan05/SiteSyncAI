// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { DiffView, DiffModeEnum } from "@git-diff-view/react";
// // import "@git-diff-view/react/styles/diff-view.css";

// import { Diff, Hunk } from "react-diff-view";
// import "react-diff-view/style/index.css";
// import { makeParsedDiff } from "@/utils/diff";

// import { makeDiffFile } from "../../../utils/diff";
// import { useAuth } from "@/hooks/usAuth";
// import { API_ROUTES } from "@/config";
// import { AnalysisInsight } from "@/types/project.type";
// import { MetricInfo } from "@/components/MetricInfo";

// export default function ProjectAnalysisPage() {
//   const router = useRouter();
//   const { projectId } = useParams<{ projectId: string }>();
//   const { token } = useAuth();

//   const [analysis, setAnalysis] = useState<AnalysisInsight[]>([]);
//   const [status, setStatus] = useState<"pending"|"complete"|string>("");
//   const [rerunning, setRerunning] = useState(false);
//   const [rerunStatus, setRerunStatus] = useState("");
//   const pollingRef = useRef<NodeJS.Timeout | null>(null);

//   const fetchAnalysis = async () => {
//     if (!token) return;
//     const res = await fetch(API_ROUTES.PROJECT_DETAILS(projectId), {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!res.ok) return console.error(data);
//     setAnalysis(Array.isArray(data.analysisSummary) ? data.analysisSummary : []);
//     setStatus(typeof data.status === "string" ? data.status : "");
//   };

//   const handleRerun = async () => {
//     if (!token) return;
//     setRerunning(true);
//     setRerunStatus("Re-running analysis...");
//     const res = await fetch(API_ROUTES.RERUN(projectId), {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setRerunStatus(res.ok ? "Analysis started!" : "Failed to start.");
//     if (res.ok) {
//       setStatus("pending");
//       setAnalysis([]);
//     }
//     setRerunning(false);
//   };

//   useEffect(() => { fetchAnalysis(); }, [projectId, token]);

//   useEffect(() => {
//     if (status === "pending") {
//       pollingRef.current = setInterval(fetchAnalysis, 5000);
//     } else {
//       clearInterval(pollingRef.current!);
//     }
//     return () => clearInterval(pollingRef.current!);
//   }, [status]);

//   return (
//     <div className="p-6 mt-10 space-y-6">
//       <button
//         className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 transition"
//         onClick={() => router.back()}
//       >
//         ← Back
//       </button>

//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Project Analysis</h1>
//         <button onClick={handleRerun} disabled={rerunning}
//           className="px-4 py-2 border border-blue-400 text-white rounded-full hover:bg-gray-800 disabled:opacity-50">
//           🔄 Rerun
//         </button>
//       </div>

//       {rerunStatus && <p className="text-sm text-gray-400">{rerunStatus}</p>}

//       {analysis.map((insight, idx) => (
//         <div key={idx} className="mb-8 bg-[#1a1a2e]/70 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold text-blue-400 mb-4">
//             Route: {insight.route}
//           </h2>

//           {/* Metrics Grid */}
//           {insight.performanceData.map((metrics, i) => (
//             <div key={i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//               {Object.entries(metrics).map(([name, detail]) => (
//                 <div key={name}
//                   className="bg-[#111827] p-4 rounded-lg border border-gray-700">
//                   <h3 className="text-lg font-medium text-purple-300">
//                     {name}<MetricInfo metric={name}/>
//                   </h3>
//                   <p className="text-sm text-gray-300">
//                     Value: <span className="font-semibold text-white">{detail.value}</span>
//                   </p>
//                   <p className="mt-2 text-sm text-gray-400">Recommended Steps:</p>
//                   <ul className="list-disc list-inside text-sm text-gray-500">
//                     {detail.recommendedSteps.map((step:string, j:number) => <li key={j}>{step}</li>)}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           ))}

//           {/* Code changes */}
//           {insight.codeChanges &&
//             Object.values(insight.codeChanges).flat().map((chg:any,j:number)=>{
//               const file = makeParsedDiff(chg.file, chg.oldCode, chg.newCode);
//               return (
//                 <div key={j} className="mb-6">
//                   <div className="flex justify-between text-xs text-gray-400 mb-1">
//                     <span>{chg.file} (lines {chg.startLine}–{chg.endLine})</span>
//                     <button
//                       className="text-blue-400 hover:underline"
//                       onClick={()=>navigator.clipboard.writeText(chg.newCode)}
//                     >Copy New</button>
//                   </div>
//                   <div className="rounded-lg overflow-hidden">
//                     <Diff viewType="split" diffType={file.type} hunks={file.hunks}>
//                       {hunks => hunks.map(h=><Hunk key={h.content} hunk={h}/>)}
//                     </Diff>
//                   </div>
//                   {chg.explanation && <p className="italic text-gray-400 mt-2">{chg.explanation}</p>}
//                 </div>
//               );
//             })}
//         </div>
//       ))}

//       {(status === "pending" && analysis.length > 0) && (
//         <div className="flex justify-center py-4">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       )}
//       {(analysis.length === 0 && status === "complete") && (
//         <p className="text-gray-400">No routes found for analysis.</p>
//       )}
//     </div>
//   );
// }

// app/(your-route)/project/[projectId]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";

import { useAuth } from "@/hooks/usAuth";
import { API_ROUTES } from "@/config";
import { AnalysisInsight } from "@/types/project.type";
import { MetricInfo } from "@/components/MetricInfo";
import { CodeChangesPanel } from "@/components/CodeChangesPanel";

export default function ProjectAnalysisPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();

  const [analysis, setAnalysis] = useState<AnalysisInsight[]>([]);
  const [status, setStatus] = useState<"pending" | "complete" | string>("");
  const [rerunning, setRerunning] = useState(false);
  const [rerunStatus, setRerunStatus] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!token) return;
    const res = await fetch(API_ROUTES.PROJECT_DETAILS(projectId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      return;
    }
    setAnalysis(
      Array.isArray(data.analysisSummary) ? data.analysisSummary : []
    );
    setStatus(typeof data.status === "string" ? data.status : "");
  }, [projectId, token]);

  async function handleRerun() {
    if (!token) return;
    setRerunning(true);
    setRerunStatus("Re-running analysis...");
    const res = await fetch(API_ROUTES.RERUN(projectId), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRerunStatus(res.ok ? "Analysis started!" : "Failed to start.");
    if (res.ok) {
      setStatus("pending");
      setAnalysis([]);
    }
    setRerunning(false);
  }

  useEffect(() => {
    fetchAnalysis();
  }, [projectId, token, fetchAnalysis]);

  useEffect(() => {
    if (status === "pending") {
      pollingRef.current = setInterval(fetchAnalysis, 5000);
    } else {
      clearInterval(pollingRef.current!);
    }
    return () => clearInterval(pollingRef.current!);
  }, [status, fetchAnalysis]);

  return (
    <div className="p-6 mt-10 space-y-6">
      {/* Header Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border-2 border-blue-400 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition"
        >
          ← Back
        </button>
        <button
          onClick={handleRerun}
          disabled={rerunning}
          className="px-4 py-2 border-2 border-blue-400 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white disabled:opacity-50 transition"
        >
          🔄 Rerun
        </button>
      </div>
      {rerunStatus && <p className="text-sm text-gray-400">{rerunStatus}</p>}

      {/* Loading State */}
      {analysis.length === 0 && status === "pending" && (
        <div className="flex flex-col items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-400">Preparing analysis…</p>
        </div>
      )}

      {/* Analysis Cards */}
      {analysis.map((insight, idx) => (
        <div
          key={idx}
          className="bg-[#1a1a2e]/70 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6"
        >
          {/* Route */}
          <h2 className="text-xl font-semibold text-blue-400">
            Route: {insight.route}
          </h2>

          {/* Metrics Grid */}
          {insight.performanceData.map((metrics, mi) => (
            <div
              key={mi}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {Object.entries(metrics).map(([name, detail]) => (
                <div
                  key={name}
                  className="bg-[#111827] p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-purple-300">
                      {name}
                      <MetricInfo metric={name} />
                    </h3>
                  </div>
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
                    {detail.recommendedSteps.map((step: string, si: number) => (
                      <li key={si}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {insight.codeChanges && (
            <CodeChangesPanel
              changes={Object.entries(insight.codeChanges).flatMap(
                ([metric, arr]: [
                  string,
                  Array<{
                    file: string;
                    startLine: number;
                    endLine: number;
                    oldCode: string;
                    newCode: string;
                    explanation?: string;
                  }>
                ]) =>
                  arr.map((c) => ({
                    file: c.file,
                    startLine: c.startLine,
                    endLine: c.endLine,
                    oldCode: c.oldCode,
                    newCode: c.newCode,
                    explanation: c.explanation,
                    metric: metric,
                  }))
              )}
            />
          )}
        </div>
      ))}

      {/* Polling Spinner */}
      {status === "pending" && analysis.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No Results */}
      {analysis.length === 0 && status === "complete" && (
        <p className="text-gray-400">No routes found for analysis.</p>
      )}
    </div>
  );
}
