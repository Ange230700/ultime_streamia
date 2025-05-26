// src/app/api/videos/[videoId]/route.ts

import { success, error } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> },
) {
  const { videoId } = await params;
  const id = parseInt(videoId, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 },
    );
  }

  try {
    const v = await prisma.video.findUnique({
      where: { video_id: BigInt(id) },
      include: {
        categories: {
          select: {
            category: {
              select: {
                category_id: true,
                category_name: true,
              },
            },
          },
        },
      },
    });

    if (!v) {
      return error("Video not found", 404);
    }

    // convert blob → base64 thumbnail
    let thumbnail: string | undefined;
    if (v.thumbnail) {
      thumbnail = Buffer.from(v.thumbnail).toString("base64");
    }

    // convert blob → base64 video data
    let videoData: string | undefined;
    if (v.video_data) {
      videoData = Buffer.from(v.video_data).toString("base64");
    }

    const payload = {
      video_id: Number(v.video_id),
      video_title: v.video_title,
      video_description: v.video_description,
      is_available: v.is_available,
      thumbnail,
      video_data: videoData,
      categories: v.categories.map((cv) => ({
        category_id: Number(cv.category.category_id),
        category_name: cv.category.category_name,
      })),
    };

    return success(payload, 200);
  } catch (e: unknown) {
    console.error("GET /api/videos/[videoId] error:", e);
    return error("Failed to fetch video", 500);
  }
}
