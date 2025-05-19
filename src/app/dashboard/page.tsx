// src/app/dashboard/page.tsx
"use client";

import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* … your dashboard UI … */}
      </div>
    </ProtectedRoute>
  );
}
