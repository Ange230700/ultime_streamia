// src\app\api\videos\route.ts

import { withValidation } from "@/lib/withValidation";
import { createVideoSchema, CreateVideoInput } from "@/schemas/videoSchemas";
import { success } from "@/utils/apiResponse";
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
    orderBy: { release_date: "desc" },
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
    categories: v.categories.map((cv) => ({
      category_id: Number(cv.category.category_id),
      category_name: cv.category.category_name,
    })),
  }));

  return success({ videos: payload, total }, 200);
}

// POST /api/videos
async function handleCreateVideo(request: Request, data: CreateVideoInput) {
  const newVideo = await prisma.video.create({
    data: {
      video_title: data.video_title,
      video_description: data.video_description,
      is_available: data.is_available ?? true,
      release_date: new Date(),
      // …map other fields
    },
  });
  return success(newVideo, 201);
}

export const POST = withValidation(createVideoSchema, handleCreateVideo);
