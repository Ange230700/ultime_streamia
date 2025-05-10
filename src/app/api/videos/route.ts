// src\app\api\videos\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/videos
export async function GET() {
  const videos = await prisma.video.findMany();
  return NextResponse.json(videos);
}

// POST /api/videos
export async function POST(request: Request) {
  const data = await request.json();
  const newVideo = await prisma.video.create({ data });
  return NextResponse.json(newVideo, { status: 201 });
}
