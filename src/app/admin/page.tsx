// src/app/admin/page.tsx
"use client";

import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {/* … admin UI … */}
      </div>
    </ProtectedRoute>
  );
}
