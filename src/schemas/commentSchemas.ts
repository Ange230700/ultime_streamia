// src/schemas/commentSchemas.ts

import { z } from "zod";

export const createCommentSchema = z.object({
  user_id: z.number().int(),
  video_id: z.number().int(),
  comment_content: z.string().min(1),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
