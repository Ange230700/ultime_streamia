// src\app\api\categories\[categoryId]\videos\route.ts

import { success, error } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import type { Video } from "@/app/contexts/VideoContext";
import type { Prisma } from "@prisma/client";

// fetches both total count and paged videos for a category
async function getVideosByCategory(
  categoryId: number,
  offset: number,
  limit: number,
): Promise<{ videos: Video[]; total: number }> {
  // build the where clause for videos linked to this category
  const where: Prisma.videoWhereInput = {
    categories: {
      some: { category_id: BigInt(categoryId) },
    },
  };

  const [total, rawVideos] = await Promise.all([
    prisma.video.count({ where }),
    prisma.video.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { release_date: "desc" },
      include: {
        categories: {
          include: { category: true },
        },
      },
    }),
  ]);

  // shape into your VideoContext interface
  const videos: Video[] = rawVideos.map((v) => ({
    video_id: Number(v.video_id),
    video_title: v.video_title,
    video_description: v.video_description ?? undefined,
    is_available: v.is_available,
    thumbnail: v.thumbnail
      ? Buffer.from(v.thumbnail).toString("base64")
      : undefined,
    categories: v.categories.map((cv) => ({
      category_id: Number(cv.category.category_id),
      category_name: cv.category.category_name,
    })),
  }));

  return { videos, total };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId: categoryIdStr } = await params;
    const categoryId = parseInt(categoryIdStr, 10);
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);

    const { videos, total } = await getVideosByCategory(
      categoryId,
      offset,
      limit,
    );

    return success({ videos, total }, 200);
  } catch (err) {
    console.error(err);
    return error("Failed to load videos for category", 500);
  }
}
