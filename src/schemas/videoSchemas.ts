// src/schemas/videoSchemas.ts

import { z } from "zod";

export const createVideoSchema = z.object({
  video_title: z.string().min(1).max(255),
  video_description: z.string().optional(),
  is_available: z.boolean().optional(),
  // …any other fields you accept
});
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
