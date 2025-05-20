// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { useAuth } from "@/hooks/usAuth";

const fullText = "Optimize your website performance with AI audits";

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuth();

  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const textIndexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
        const typeInterval = setInterval(() => {
          const index = textIndexRef.current;
          if (index < fullText.length) {
            setDisplayedText((prev) => prev + fullText[index]);
            textIndexRef.current += 1;
          } else {
            clearInterval(typeInterval);
            setIsTypingDone(true);
          }
        }, 50);
        return () => clearInterval(typeInterval);
      }, []);
    

  const handlePrimary = () => {
    router.push(token ? "/dashboard" : "/auth/login");
  };
  const handleDemo = () => {
    window.open('https://www.loom.com/share/ec3366bc6c1f433385c16c2bf3436aaa?sid=79b2382a-ccee-4017-a0fe-1ff7035e1bcb', '_blank');
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden  text-white">
      {/* Animated gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />

      {/* Hero */}
      <h1 className="z-10 text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse leading-tight">
        SiteSync
      </h1>

      <p className="z-10 mt-6 text-center text-lg md:text-xl font-medium text-gray-300 max-w-2xl h-14">
        {displayedText}
        <span
          className={`inline-block w-1 h-7 bg-gray-300 ml-1 transition-opacity ${
            isTypingDone ? "opacity-0" : "opacity-100 animate-blink"
          }`}
        />
      </p>

      {/* Buttons */}
      <div className="z-10 mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePrimary}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg hover:scale-105 transition"
        >
          {token ? "Go to Console" : "Get Started"}
          <ArrowRightAltOutlinedIcon />
        </button>
        <button
          onClick={handleDemo}
          className="px-8 py-3 border-2 border-purple-400 text-purple-300 rounded-full text-lg hover:bg-purple-600 hover:text-white transition"
        >
          See Demo
        </button>
      </div>

      {/* Feature Grid */}
      <div className="z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-center">
        {[
          {
            title: "AI-Powered Insights",
            desc: "Get laser-focused recommendations that fix real performance issues.",
          },
          {
            title: "Dev-First Reports",
            desc: "Code-level diffs and explanations, ready for your CI pipeline.",
          },
          {
            title: "Team Collaboration",
            desc: "Share audits, track progress, and integrate feedback in one place.",
          },
        ].map((f) => (
          <div key={f.title} className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <h4 className="text-xl font-semibold text-white mb-2">{f.title}</h4>
            <p className="text-gray-300">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </main>
  );
}
