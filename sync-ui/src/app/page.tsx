"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import Button from "@/components/Button";
import { useAuth } from "../hooks/usAuth";

const fullText = "Optimize your website performance with AI audits...";

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuth();

  const [displayedText, setDisplayedText] = useState("");
  const [dots, setDots] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const textIndexRef = useRef(0);

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

  useEffect(() => {
    if (!isTypingDone) return;
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots(".".repeat(dotCount));
    }, 500);
    return () => clearInterval(dotInterval);
  }, [isTypingDone]);

  const handleClick = () => {
    if (token) {
      router.push("/dashboard"); 
    } else {
      router.push("/auth/login"); 
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse leading-none pb-3">
        SiteSync
      </h1>

      <p className="mt-6 text-lg md:text-xl font-medium text-gray-300 text-center max-w-xl px-4 h-12">
        {displayedText}
        {/* <span className="text-blue-400">{isTypingDone && dots}</span> */}
      </p>

      <button
        className="mt-5 px-10 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg hover:scale-110 transition-transform shadow-md"
        onClick={handleClick}
      >
        {token ? "Go to Console" : "Get Started"}
        <ArrowRightAltOutlinedIcon className="text-white" />
      </button>
    </main>
  );
}
