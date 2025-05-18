// src\app\providers\CategoryProvider.tsx

"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import PropTypes from "prop-types";
import {
  CategoryContext,
  Category,
  CategoryContextType,
} from "@/app/contexts/CategoryContext";
import type { ApiResponse } from "@/types/api-response";

export function CategoryProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [categories, setCategories] = useState<Category[]>([]);

  const refreshCategories = useCallback(async () => {
    const res = await axios.get<ApiResponse<Category[]>>("/api/categories");

    if (res.data.success) {
      setCategories(res.data.data);
    } else {
      console.error("Failed to fetch categories:", res.data.error);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const value = useMemo<CategoryContextType>(
    () => ({ categories, refreshCategories }),
    [categories, refreshCategories],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
