/* src/app/signup/page.tsx */

"use client";

import React, { useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
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

  // Password field templates
  const pwHeader = <div className="mb-3 font-bold">Pick a password</div>;
  const pwFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="line-height-3 mt-0 ml-2 pl-2">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  // Validation logic
  const isPasswordValid = useMemo(() => {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    return passwordRegex.test(password);
  }, [password]);
  const isConfirmValid = useMemo(
    () => confirm.length > 0 && password === confirm,
    [password, confirm],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid) {
      showToast({
        severity: "error",
        summary: "Invalid Password",
        detail: "Password does not meet criteria",
        life: 3000,
      });
      return;
    }
    if (!isConfirmValid) {
      showToast({
        severity: "error",
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
        className="flex w-full max-w-sm flex-col items-center gap-2 rounded-lg p-6 shadow-md"
      >
        <h2 className="mb-8 text-2xl font-semibold">Create an account</h2>

        <div className="mb-8 flex w-full flex-col gap-8">
          <FloatLabel className="flex w-full flex-col gap-2">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              required
              className="w-full rounded-lg px-3 py-2 shadow-sm"
            />
            <label
              htmlFor="username"
              className="text-surface-900 dark:text-surface-0 leading-normal font-medium"
            >
              Username
            </label>
          </FloatLabel>

          <FloatLabel className="flex w-full flex-col gap-2">
            <InputText
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              toggleMask
              header={pwHeader}
              footer={pwFooter}
              invalid={!isPasswordValid && password.length > 0}
            />
            <label
              htmlFor="password"
              className="text-surface-900 dark:text-surface-0 leading-normal font-medium"
            >
              Password
            </label>
          </FloatLabel>

          <FloatLabel className="flex w-full flex-col gap-2">
            <Password
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              required
              toggleMask
              feedback={false}
              invalid={!isConfirmValid && confirm.length > 0}
            />
            <label
              htmlFor="password"
              className="text-surface-900 dark:text-surface-0 leading-normal font-medium"
            >
              Confirm Password
            </label>
          </FloatLabel>
        </div>

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
