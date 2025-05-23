/* src/app/signup/page.tsx */

"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
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
        className="flex w-full max-w-sm flex-col items-center gap-8 rounded-lg p-6 shadow-md"
      >
        <h2 className="mb-8 text-2xl font-semibold">Create an account</h2>

        <FloatLabel>
          <InputText
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
          />
          <label htmlFor="username">Username</label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <label htmlFor="email">Email</label>
        </FloatLabel>

        <FloatLabel>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            toggleMask
          />
          <label htmlFor="password">Password</label>
        </FloatLabel>

        <FloatLabel>
          <Password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            toggleMask
          />
          <label htmlFor="password">Confirm Password</label>
        </FloatLabel>

        <Button
          label={loading ? "Signing up..." : "Sign Up"}
          type="submit"
          className="p-button-raised"
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
