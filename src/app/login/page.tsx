// src/app/login/page.tsx

"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
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
        className="bg-surface w-full max-w-sm rounded-lg p-6 shadow-md"
      >
        <h2 className="mb-4 text-2xl font-semibold">Login to Streamia</h2>

        <label className="mb-2 block font-medium">
          Email
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mb-4 w-full"
          />
        </label>

        <label className="mb-2 block font-medium">
          Password
          <InputText
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mb-6 w-full"
          />
        </label>

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
