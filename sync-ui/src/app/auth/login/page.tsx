"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/usAuth";
import { API_ROUTES } from "@/config";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(form);
    if (ok) return router.push("/dashboard");
    setError("Invalid credentials");
  };

  const  handleGoogleResponse = useCallback(async (response: { credential: string }) =>  {
    try {
      const res = await fetch(API_ROUTES.GOOGLE_AUTH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      if (!res.ok) throw new Error("Google login failed");
      const { token } = await res.json();
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google sign‑in failed");
    }
  },[router]);

  // ─── Google Sign‑In Integration ────────────────────────────────────
  useEffect(() => {
    // only run on client, and only if google SDK is loaded
    if (typeof window === "undefined" || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin")!,
      { theme: "outline", size: "large" }
    );
    // optionally show the One‑Tap prompt:
    // window.google.accounts.id.prompt();
  }, [handleGoogleResponse]);

  
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a2e] p-8 rounded-xl w-full max-w-md space-y-6 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center">Log In</h2>
        {error && <p className="text-red-400">{error}</p>}

        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
        />
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <Button type="submit" fullWidth>
          Log In
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-600" />
          <span className="text-gray-400">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Google Sign‑In button container */}
        <div id="google-signin" className="flex justify-center" />

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
