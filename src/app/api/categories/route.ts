// src\app\api\categories\route.ts

import { success, error } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/schemas/categorySchemas";

// GET /api/categories
export async function GET() {
  const categories = await prisma.category.findMany();
  const safeCategories = categories.map((cat) => ({
    category_id: Number(cat.category_id),
    category_name: cat.category_name,
  }));
  return success(safeCategories, 200);
}

// POST /api/categories
export async function POST(request: Request) {
  const json = await request.json();
  const result = createCategorySchema.safeParse(json);

  if (!result.success) {
    return error("Invalid category input", 400, result.error.flatten());
  }
  const { category_name } = result.data;
  const newCat = await prisma.category.create({ data: { category_name } });
  return success(newCat, 201);
}
