import { useState, useEffect } from 'react';
import { CategoryDetail } from '../types';
import { categoryDetails as defaultCategoryDetails } from '../data';

const STORAGE_KEY = 'genfocus_categories_v3';

const initialCategories: CategoryDetail[] = Object.entries(defaultCategoryDetails).map(([name, cat], idx) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  order: idx,
  ...cat
}));

function loadInitialCategories(): CategoryDetail[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load categories from localStorage:', err);
  }
  return initialCategories;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDetail[]>(loadInitialCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (err) {
      console.error('Failed to save categories to localStorage:', err);
    }
  }, [categories]);

  const addCategory = (newCat: Omit<CategoryDetail, 'id'> & { id?: string }) => {
    const id = newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now().toString();
    const catToSave: CategoryDetail = {
      ...newCat,
      id,
      order: newCat.order ?? categories.length,
      groups: newCat.groups || [],
      popularTags: newCat.popularTags || []
    };
    setCategories(prev => [...prev.filter(c => c.id !== id), catToSave]);
  };

  const editCategory = (id: string, updated: Partial<CategoryDetail>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated, id } : c)));
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const resetToDefaults = () => {
    setCategories(initialCategories);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
    } catch (err) {
      console.error('Failed to reset categories in localStorage:', err);
    }
  };

  const categoryNames = categories.map(c => c.name);

  const categoryDetailsMap: Record<string, CategoryDetail> = {};
  categories.forEach(c => {
    categoryDetailsMap[c.name] = c;
    categoryDetailsMap[c.name.toLowerCase()] = c;
  });

  return {
    categories,
    categoryNames,
    categoryDetailsMap,
    loading,
    addCategory,
    editCategory,
    removeCategory,
    resetToDefaults
  };
}
