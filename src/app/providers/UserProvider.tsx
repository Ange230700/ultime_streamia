// src\app\providers\UserProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import { UserContext, User, UserContextType } from "../contexts/UserContext";
import isTokenExpired from "@/app/modules/isTokenExpired";

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      axios
        .get<User>("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post<{ token: string; user: User }>(
      "/api/users/login",
      { email, password },
    );
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
