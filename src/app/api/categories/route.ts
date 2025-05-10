// src\app\api\categories\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories
export async function GET() {
  const categories = await prisma.category.findMany();
  const safeCategories = categories.map((cat) => ({
    category_id: Number(cat.category_id),
    category_name: cat.category_name,
  }));
  return NextResponse.json(safeCategories);
}

// POST /api/categories
export async function POST(request: Request) {
  const { category_name } = await request.json();
  const newCat = await prisma.category.create({ data: { category_name } });
  return NextResponse.json(newCat, { status: 201 });
}
