// src\app\contexts\CategoryContext.tsx

"use client";
import { createContext } from "react";

export interface Category {
  category_id: number;
  category_name: string;
}

export interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  refreshCategories: async () => {},
});
