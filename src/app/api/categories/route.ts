// src\app\api\categories\route.ts

import { withValidation } from "@/lib/withValidation";
import {
  createCategorySchema,
  CreateCategoryInput,
} from "@/schemas/categorySchemas";
import { success } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";

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
async function handleCreateCategory(
  request: Request,
  data: CreateCategoryInput,
) {
  const newCat = await prisma.category.create({
    data: { category_name: data.category_name },
  });
  return success(newCat, 201);
}

export const POST = withValidation(createCategorySchema, handleCreateCategory);
