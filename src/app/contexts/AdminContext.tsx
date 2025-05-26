// src\app\contexts\AdminContext.tsx

"use client";

import { createContext, Dispatch, SetStateAction } from "react";

export interface AdminContextType {
  adminView: boolean;
  setAdminView: Dispatch<SetStateAction<boolean>>;
}

// Default value won’t actually be used because we’ll always wrap
export const AdminContext = createContext<AdminContextType>({
  adminView: false,
  setAdminView: () => {},
});
