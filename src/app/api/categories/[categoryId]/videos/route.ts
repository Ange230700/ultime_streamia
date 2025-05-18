// src\app\api\categories\[categoryId]\videos\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Video } from "@/app/contexts/VideoContext";

// fetches both total count and paged videos for a category
async function getVideosByCategory(
  categoryId: number,
  offset: number,
  limit: number,
): Promise<{ videos: Video[]; total: number }> {
  // build the where clause for videos linked to this category
  const where = {
    category_video: {
      some: { category_id: BigInt(categoryId) },
    },
  };

  // run count + page query in parallel
  const [total, rawVideos] = await Promise.all([
    prisma.video.count({ where }),
    prisma.video.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { release_date: "desc" },
      include: {
        category_video: {
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
    cover_image_data: v.cover_image_data
      ? Buffer.from(v.cover_image_data).toString("base64")
      : undefined,
    categories: v.category_video
      .map((cv) => cv.category) // get the category or null
      .filter((c): c is NonNullable<typeof c> => c != null) // drop the nulls
      .map((c) => ({
        // now c is non-null
        category_id: Number(c.category_id),
        category_name: c.category_name,
      })),
  }));

  return { videos, total };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const url = new URL(req.url);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const categoryId = parseInt(params.categoryId, 10);

    const { videos, total } = await getVideosByCategory(
      categoryId,
      offset,
      limit,
    );
    return NextResponse.json({ videos, total });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load videos for category" },
      { status: 500 },
    );
  }
}
