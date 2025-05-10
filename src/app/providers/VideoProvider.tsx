// src\app\providers\MovieProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import {
  VideoContext,
  Video,
  VideoContextType,
} from "../contexts/VideoContext";

export function MovieProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [movies, setMovies] = useState<Video[]>([]);

  const refreshMovies = useCallback(async () => {
    try {
      const res = await axios.get<Video[]>("/api/videos");
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  }, []);

  useEffect(() => {
    refreshMovies();
  }, [refreshMovies]);

  const value = useMemo<VideoContextType>(
    () => ({ movies, refreshMovies }),
    [movies, refreshMovies],
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

MovieProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
