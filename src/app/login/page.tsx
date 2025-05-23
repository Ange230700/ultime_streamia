// src/app/login/page.tsx

"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { ToastContext } from "@/app/ClientLayout";
import { UserContext } from "@/app/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const showToast = useContext(ToastContext);
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast({
        severity: "success",
        summary: "Logged in",
        detail: "Welcome back!",
        life: 3000,
      });
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showToast({
        severity: "error",
        summary: "Login failed",
        detail: message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        style={{ backgroundColor: "var(--surface-section)" }}
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-2 rounded-lg p-6 shadow-md"
      >
        <h2 className="mb-8 text-2xl font-semibold">Login to Streamia</h2>

        <p className="flex items-center justify-center text-center">
          Don&apos;t have an account?{" "}
          <Button
            label="Sign up here"
            link
            onClick={(e) => {
              e.preventDefault();
              router.push("/signup");
            }}
          />
        </p>

        <div className="mb-8 flex w-full flex-col gap-8">
          <FloatLabel className="flex w-full flex-col gap-2">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-lg px-3 py-2 shadow-sm"
            />
            <label
              htmlFor="email"
              className="text-surface-900 dark:text-surface-0 leading-normal font-medium"
            >
              Email
            </label>
          </FloatLabel>

          <FloatLabel className="flex w-full flex-col gap-2">
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              toggleMask
              feedback={false}
            />
            <label
              htmlFor="password"
              className="text-surface-900 dark:text-surface-0 leading-normal font-medium"
            >
              Password
            </label>
          </FloatLabel>
        </div>

        <Button
          label={loading ? "Logging in..." : "Login"}
          type="submit"
          className="p-button-raised w-full"
          disabled={loading}
        />
      </form>
    </div>
  );
}
