/* src/app/signup/page.tsx */

"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ToastContext } from "@/app/ClientLayout";
import authAxios from "@/lib/authAxios";

export default function SignupPage() {
  const router = useRouter();
  const showToast = useContext(ToastContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      showToast({
        severity: "warn",
        summary: "Mismatch",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      await authAxios.post(
        "/api/users/register",
        { username, email, password },
        { withCredentials: true },
      );
      showToast({
        severity: "success",
        summary: "Account created",
        detail: "Please log in.",
        life: 3000,
      });
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showToast({
        severity: "error",
        summary: "Signup failed",
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
        <h2 className="mb-4 text-2xl font-semibold">Create an account</h2>

        <label className="mb-2 block font-medium">
          Username
          <InputText
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-4 w-full"
          />
        </label>

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
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            type="password"
            required
            className="mb-4 w-full"
          />
        </label>

        <label className="mb-6 block font-medium">
          Confirm Password
          <Password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            toggleMask
            type="password"
            required
            className="mb-4 w-full"
          />
        </label>

        <Button
          label={loading ? "Signing up..." : "Sign Up"}
          type="submit"
          className="p-button-raised w-full"
          disabled={loading}
        />

        <p className="mt-4 flex items-center justify-center text-center">
          Already have an account?{" "}
          <Button
            label="Log in here"
            link
            onClick={(e) => {
              e.preventDefault();
              router.push("/login");
            }}
          />
        </p>
      </form>
    </div>
  );
}
