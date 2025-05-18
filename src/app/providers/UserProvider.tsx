// src\app\providers\UserProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import { UserContext, User, UserContextType } from "../contexts/UserContext";

let accessToken: string | null = null;

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    refreshToken(); // Try refreshing on load
  }, []);

  const refreshToken = async () => {
    try {
      const res = await axios.get<{ token: string }>("/api/auth/refresh", {
        withCredentials: true,
      });
      accessToken = res.data.token;
      const me = await axios.get<User>("/api/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(me.data);
    } catch {
      accessToken = null;
      setUser(null);
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

  const logout = () => {
    accessToken = null;
    setUser(null);
    document.cookie = "refresh_token=; Max-Age=0; path=/;";
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
