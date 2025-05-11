// src\app\providers\VideoProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import {
  VideoContext,
  Video,
  VideoContextType,
} from "@/app/contexts/VideoContext";

export function VideoProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<Video[]>("/api/videos");
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshVideos();
  }, [refreshVideos]);

  const value = useMemo<VideoContextType>(
    () => ({ videos, loading, refreshVideos }),
    [videos, loading, refreshVideos],
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

VideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
