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

export function CategoryProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [categories, setCategories] = useState<Category[]>([]);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await axios.get<Category[]>("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
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
