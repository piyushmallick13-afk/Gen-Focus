import { useState, useEffect, useMemo } from 'react';
import { CategoryDetail } from '../types';
import { allCategories, categoryDetailsList as defaultCategoryDetails } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDetail[]>(defaultCategoryDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoriesRef = collection(db, 'categories');
    
    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          defaultCategoryDetails.forEach(category => {
            const ref = doc(db, 'categories', category.id);
            batch.set(ref, category);
          });
          batch.commit().catch(err => {
            console.warn("Could not auto-seed default categories to Firestore:", err);
          });
        } catch (err) {
          console.warn("Could not prepare default categories batch:", err);
        }
        setCategories(defaultCategoryDetails);
        setLoading(false);
        return;
      }

      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CategoryDetail));
      
      fetchedCategories.sort((a, b) => Number(a.id) - Number(b.id));
      setCategories(fetchedCategories);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore categories onSnapshot error, using local categories:", error);
      setCategories(defaultCategoryDetails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categoryNames = useMemo(() => {
    const fromCategories = Array.isArray(categories) && categories.length > 0
      ? categories.map(c => c.name).filter(Boolean)
      : [];
    const combined = Array.from(new Set([...fromCategories, ...allCategories]));
    return combined.length > 0 ? combined : allCategories;
  }, [categories]);

  const categoryDetailsMap = useMemo(() => {
    const map: Record<string, CategoryDetail> = {};
    allCategories.forEach((name, idx) => {
      map[name] = {
        id: `default-${idx}`,
        name,
        description: `Explore curated ${name} essentials designed for everyday living.`,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop'
      };
    });
    defaultCategoryDetails.forEach(cat => {
      if (cat?.name) {
        map[cat.name] = cat;
      }
    });
    if (Array.isArray(categories)) {
      categories.forEach(cat => {
        if (cat?.name) {
          map[cat.name] = {
            ...map[cat.name],
            ...cat
          };
        }
      });
    }
    return map;
  }, [categories]);

  const addCategory = async (category: CategoryDetail) => {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error("Error removing category:", error);
    }
  };

  const editCategory = async (updatedCategory: CategoryDetail) => {
    try {
      await setDoc(doc(db, 'categories', updatedCategory.id), updatedCategory);
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const resetDefaults = async () => {
    try {
      const batch = writeBatch(db);
      defaultCategoryDetails.forEach(cat => {
        const ref = doc(db, 'categories', cat.id);
        batch.set(ref, cat);
      });
      await batch.commit();
      setCategories(defaultCategoryDetails);
    } catch (error) {
      console.warn("Error resetting default categories:", error);
      setCategories(defaultCategoryDetails);
    }
  };

  return { 
    categories, 
    categoryNames, 
    categoryDetailsMap, 
    loading, 
    addCategory, 
    removeCategory, 
    editCategory,
    resetDefaults
  };
}
