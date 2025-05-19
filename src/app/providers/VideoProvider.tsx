// src\app\providers\VideoProvider.tsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import {
  VideoContext,
  Video,
  VideoContextType,
} from "@/app/contexts/VideoContext";
import http from "@/lib/http";

interface VideosResponse {
  videos: Video[];
  total: number;
}

interface VideoQueryParams {
  offset: number;
  limit: number;
  categoryId?: number;
}

export function VideoProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchVideos = useCallback(
    async (
      offset: number,
      limit: number,
      params?: { categoryId?: number },
    ): Promise<Video[]> => {
      const query: VideoQueryParams = { offset, limit };
      if (params?.categoryId != null) {
        query.categoryId = params.categoryId;
      }
      const res = await http.get<VideosResponse>("/api/videos", {
        params: query,
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
