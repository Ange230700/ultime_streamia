// src/app/api/comments/route.ts

import { withValidation } from "@/lib/withValidation";
import {
  createCommentSchema,
  CreateCommentInput,
} from "@/schemas/commentSchemas";
import { success } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";

async function handleCreateComment(request: Request, data: CreateCommentInput) {
  const created = await prisma.comment.create({
    data: {
      user_id: BigInt(data.user_id),
      video_id: BigInt(data.video_id),
      comment_content: data.comment_content,
    },
  });
  return success(created, 201);
}

export const POST = withValidation(createCommentSchema, handleCreateComment);
