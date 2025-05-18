// src\app\providers\UserProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import { UserContext, User, UserContextType } from "../contexts/UserContext";

let accessToken: string | null = null;
let refreshAbortController: AbortController | null = null;

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    refreshToken(); // Try refreshing on load
  });

  const refreshToken = async () => {
    refreshAbortController?.abort(); // cancel any previous refresh
    refreshAbortController = new AbortController();

    try {
      const res = await axios.get<{ token: string }>("/api/auth/refresh", {
        withCredentials: true,
        signal: refreshAbortController.signal,
      });

      accessToken = res.data.token;

      const me = await axios.get<User>("/api/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: refreshAbortController.signal,
      });

      setUser(me.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.warn("Refresh request was cancelled");
      } else {
        console.warn("Token refresh failed, logging out…", err);
        logout();
      }
    } finally {
      refreshAbortController = null;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post<{ token: string; user: User }>(
      "/api/users/login",
      { email, password },
      { withCredentials: true },
    );
    accessToken = res.data.token;
    setUser(res.data.user);
  };

  const logout = async () => {
    accessToken = null;
    setUser(null);
    refreshAbortController?.abort(); // ✅ cancel any pending refresh
    refreshAbortController = null;
    document.cookie = "refresh_token=; Max-Age=0; path=/;";
    try {
      await axios.post("/api/users/logout", null, { withCredentials: true });
    } catch {}
  };

  const value = useMemo<UserContextType>(
    () => ({ user, login, logout }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
