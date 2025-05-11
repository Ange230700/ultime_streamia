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

interface VideosResponse {
  videos: Video[];
  total: number;
}

export function VideoProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchVideos = useCallback(
    async (offset: number, limit: number): Promise<Video[]> => {
      const res = await axios.get<VideosResponse>("/api/videos", {
        params: { offset, limit },
      });

      const { videos, total } = res.data;
      setTotalCount(total);
      return videos;
    },
    [],
  );

  useEffect(() => {
    fetchVideos(0, 1).catch(() => {});
  }, [fetchVideos]);

  const value = useMemo<VideoContextType>(
    () => ({ totalCount, fetchVideos }),
    [totalCount, fetchVideos],
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

VideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
