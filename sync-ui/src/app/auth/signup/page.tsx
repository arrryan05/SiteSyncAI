"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/usAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const ok = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setIsLoading(false);

    if (ok) {
      router.push("/dashboard");
    } else {
      setError("Signup failed. Please check your details and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0f2e]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a2e] p-8 rounded-xl w-full max-w-md space-y-6 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
        />
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
        <Input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Signing Up…" : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
}
