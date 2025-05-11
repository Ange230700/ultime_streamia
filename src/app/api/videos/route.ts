// src\app\api\videos\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/videos
export async function GET() {
  const videos = await prisma.video.findMany({
    include: {
      category_video: {
        include: { category: true },
      },
    },
    orderBy: { release_date: "desc" },
  });

  const payload = videos.map((v) => ({
    video_id: Number(v.video_id),
    video_title: v.video_title,
    video_description: v.video_description,
    is_available: v.is_available,
    cover_image_data: v.cover_image_data
      ? Buffer.from(v.cover_image_data).toString("base64")
      : null,
    categories: v.category_video.map((cv) => ({
      category_id: Number(cv.category?.category_id),
      category_name: cv.category?.category_name,
    })),
  }));

  return NextResponse.json(payload);
}

// POST /api/videos
export async function POST(request: Request) {
  const data = await request.json();
  const newVideo = await prisma.video.create({ data });
  return NextResponse.json(newVideo, { status: 201 });
}
