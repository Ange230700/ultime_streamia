// src/app/components/ProtectedRoute.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import { ProgressSpinner } from "primereact/progressspinner";

export interface ProtectedRouteProps {
  /** if true, only allow users with `user.is_admin === true` */
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  requireAdmin = false,
  children,
}: Readonly<ProtectedRouteProps>) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If not logged in, send to login
    if (user === null) {
      router.replace("/login");
    }
    // If logged in but not admin on an admin route, send to unauthorized
    else if (requireAdmin && !user.is_admin) {
      router.replace("/unauthorized");
    }
  }, [user, requireAdmin, router]);

  // While we don’t know user yet, or we’re about to redirect, show spinner
  if (user === null || (requireAdmin && user && !user.is_admin)) {
    return (
      <div className="flex h-full items-center justify-center">
        <ProgressSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
