import { useState, useEffect } from 'react';
import { CategoryDetail } from '../types';
import { categoryDetails as defaultCategoryDetails } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

const initialCategories: CategoryDetail[] = Object.entries(defaultCategoryDetails).map(([name, cat], idx) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  order: idx,
  ...cat
}));

const cleanCategory = (cat: any): Record<string, any> => {
  return {
    id: String(cat.id || ''),
    name: String(cat.name || ''),
    tagline: String(cat.tagline || ''),
    description: String(cat.description || ''),
    image: String(cat.image || ''),
    coverImage: String(cat.coverImage || cat.image || ''),
    order: typeof cat.order === 'number' ? cat.order : 0,
    popularTags: Array.isArray(cat.popularTags) ? cat.popularTags.filter((t: any) => typeof t === 'string' && t.trim() !== '') : [],
    groups: Array.isArray(cat.groups)
      ? cat.groups.map((g: any) => ({
          title: String(g?.title || ''),
          items: Array.isArray(g?.items) ? g.items.filter((i: any) => typeof i === 'string' && i.trim() !== '') : []
        }))
      : []
  };
};

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDetail[]>(initialCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catRef = collection(db, 'categories');

    const unsubscribe = onSnapshot(catRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed default categories into Firestore
        try {
          const batch = writeBatch(db);
          initialCategories.forEach((cat) => {
            const docId = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const docRef = doc(catRef, docId);
            batch.set(docRef, cleanCategory({ ...cat, id: docId }));
          });
          await batch.commit();
        } catch (e) {
          console.error("Failed to seed default categories to Firestore:", e);
        }
        setCategories(initialCategories);
        setLoading(false);
      } else {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        } as CategoryDetail));

        fetched.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setCategories(fetched);
        setLoading(false);
      }
    }, (error) => {
      console.warn("Firestore categories snapshot error, using local defaults:", error);
      setCategories(initialCategories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCategory = async (newCat: Omit<CategoryDetail, 'id'> & { id?: string }) => {
    const id = newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now().toString();
    const catToSave: CategoryDetail = {
      ...newCat,
      id,
      order: newCat.order ?? categories.length,
      groups: newCat.groups || [],
      popularTags: newCat.popularTags || []
    };

    // Optimistic update
    setCategories(prev => [...prev.filter(c => c.id !== id), catToSave]);

    try {
      await setDoc(doc(db, 'categories', id), cleanCategory(catToSave));
    } catch (err) {
      console.error("Error adding category to Firestore:", err);
    }
  };

  const editCategory = async (id: string, updated: Partial<CategoryDetail>) => {
    const existing = categories.find(c => c.id === id);
    if (!existing) return;

    const merged: CategoryDetail = {
      ...existing,
      ...updated,
      id
    };

    // Optimistic update
    setCategories(prev => prev.map(c => c.id === id ? merged : c));

    try {
      await setDoc(doc(db, 'categories', id), cleanCategory(merged));
    } catch (err) {
      console.error("Error updating category in Firestore:", err);
    }
  };

  const removeCategory = async (id: string) => {
    // Optimistic update
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      console.error("Error removing category from Firestore:", err);
    }
  };

  const resetToDefaults = async () => {
    try {
      const batch = writeBatch(db);
      // Delete existing
      categories.forEach(c => {
        if (c.id) {
          batch.delete(doc(db, 'categories', c.id));
        }
      });
      // Re-seed defaults
      initialCategories.forEach(c => {
        const docId = c.id || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        batch.set(doc(db, 'categories', docId), cleanCategory({ ...c, id: docId }));
      });
      await batch.commit();
      setCategories(initialCategories);
    } catch (err) {
      console.error("Error resetting categories:", err);
      setCategories(initialCategories);
    }
  };

  // Build helpers
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
