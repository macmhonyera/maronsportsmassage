"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginClient() {
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: from,
      redirect: true,
    });

    if (res?.error) setErr("Invalid admin credentials.");
  }

  return (
    <div className="h-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to access the dashboard
          </p>
        </div>

        <form
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          onSubmit={onSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maronfitness.co.zw"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            Sign in
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            Leave fields empty to continue (if bypass is enabled)
          </div>

          {err ? (
            <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-800">
              {err}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
