// src\app\providers\AdminProvider.tsx

"use client";
import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import { AdminContext, AdminContextType } from "@/app/contexts/AdminContext";
import { useUser } from "@/app/hooks/useUser";

export function AdminProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = useUser();
  const [adminView, setAdminView] = useState<boolean>(false);

  useEffect(() => {
    if (user?.is_admin) {
      setAdminView(true);
    }
  }, [user]);

  const value = useMemo<AdminContextType>(
    () => ({ adminView, setAdminView }),
    [adminView, setAdminView],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
