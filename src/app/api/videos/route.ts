// src\app\api\videos\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/videos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const videos = await prisma.video.findMany({
    skip: offset,
    take: limit,
    select: {
      video_id: true,
      video_title: true,
      video_description: true,
      is_available: true,
      cover_image_data: true,
    },
  });

  const total = await prisma.video.count();

  const payload = videos.map((v) => ({
    video_id: Number(v.video_id),
    video_title: v.video_title,
    video_description: v.video_description,
    is_available: v.is_available,
    cover_image_data: v.cover_image_data
      ? Buffer.from(v.cover_image_data).toString("base64")
      : null,
  }));

  return NextResponse.json({ videos: payload, total });
}

// POST /api/videos
export async function POST(request: Request) {
  const data = await request.json();
  const newVideo = await prisma.video.create({ data });
  return NextResponse.json(newVideo, { status: 201 });
}
