// src\app\contexts\UserContext.tsx

"use client";
import { createContext } from "react";

export interface User {
  user_id: number;
  username: string;
  email: string;
  is_admin: boolean;
  avatarUrl?: string;
}

export interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  update: (user: User) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  update: async () => {},
});
