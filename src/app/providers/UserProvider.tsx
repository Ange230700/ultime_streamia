// src\app\providers\UserProvider.tsx

"use client";
import http from "@/lib/http";
import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import { UserContext, User, UserContextType } from "@/app/contexts/UserContext";
import authAxios, { setAccessToken } from "@/lib/authAxios";
import type { ApiResponse } from "@/types/api-response";
import isTokenExpired from "@/app/modules/isTokenExpired";

let accessToken: string | null = null;
let refreshAbortController: AbortController | null = null;

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!accessToken || isTokenExpired(accessToken)) {
      refreshToken();
    }
  }, []);

  const refreshToken = async () => {
    refreshAbortController?.abort(); // Abort any existing request
    refreshAbortController = new AbortController();

    const res = await authAxios.get<ApiResponse<{ token: string }>>(
      "/api/auth/refresh",
      { withCredentials: true, signal: refreshAbortController.signal },
    );

    if (res.data.success) {
      accessToken = res.data.data.token;
      setAccessToken(accessToken);

      const me = await authAxios.get<ApiResponse<User>>("/api/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: refreshAbortController.signal,
      });

      if (me.data.success) {
        setUser(me.data.data);
      } else {
        throw new Error(me.data.error);
      }
    } else {
      throw new Error(res.data.error);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authAxios.post<
      ApiResponse<{ token: string; user: User }>
    >("/api/users/login", { email, password }, { withCredentials: true });

    if (res.data.success) {
      accessToken = res.data.data.token;
      setAccessToken(accessToken);
      setUser(res.data.data.user);
    } else {
      throw new Error(res.data.error);
    }
  };

  const logout = async () => {
    accessToken = null;
    setUser(null);
    refreshAbortController?.abort();
    refreshAbortController = null;
    document.cookie = "refresh_token=; Max-Age=0; path=/;";
    try {
      await http.post("/api/users/logout");
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
