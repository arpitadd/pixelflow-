"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { toast } from "@/hooks/useToast";

export function SignupForm() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup(form);
    if (!result.success) {
      toast(result.error ?? "Signup failed", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label" htmlFor="signup-name">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Rahul Sharma"
            className="input input-bordered w-full"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="signup-username">
            <span className="label-text font-medium">Username</span>
          </label>
          <input
            id="signup-username"
            name="username"
            type="text"
            placeholder="rahul_sharma"
            className="input input-bordered w-full"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="signup-email">
          <span className="label-text font-medium">Email</span>
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="input input-bordered w-full"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="signup-password">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="input input-bordered w-full pr-12"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
      </button>

      <p className="text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
