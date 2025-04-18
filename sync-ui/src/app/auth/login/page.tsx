"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/usAuth";

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
