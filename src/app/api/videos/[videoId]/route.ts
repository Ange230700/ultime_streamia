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

export async function PUT(
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
    const form = await request.formData();
    const data: {
      video_title?: string;
      video_description?: string;
      thumbnail?: Buffer;
      video_data?: Buffer;
    } = {};

    const titleEntry = form.get("video_title");
    if (typeof titleEntry === "string") {
      data.video_title = titleEntry;
    }

    const descEntry = form.get("video_description");
    if (typeof descEntry === "string") {
      data.video_description = descEntry;
    }

    // handle thumbnail blob
    const thumbFile = form.get("thumbnail") as File | null;
    if (thumbFile && thumbFile.size > 0) {
      const buf = Buffer.from(await thumbFile.arrayBuffer());
      data.thumbnail = buf;
    }

    // handle video_data blob
    const videoFile = form.get("video_data") as File | null;
    if (videoFile && videoFile.size > 0) {
      const buf = Buffer.from(await videoFile.arrayBuffer());
      data.video_data = buf;
    }

    const v = await prisma.video.update({
      where: { video_id: BigInt(id) },
      data,
      include: {
        categories: {
          select: {
            category: {
              select: { category_id: true, category_name: true },
            },
          },
        },
      },
    });

    // rehydrate blobs to base64 for return
    let thumbnail: string | undefined;
    if (v.thumbnail) thumbnail = Buffer.from(v.thumbnail).toString("base64");

    let videoData: string | undefined;
    if (v.video_data) videoData = Buffer.from(v.video_data).toString("base64");

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
    console.error("PUT /api/videos/[videoId] error:", e);
    return error("Failed to update video", 500);
  }
}
