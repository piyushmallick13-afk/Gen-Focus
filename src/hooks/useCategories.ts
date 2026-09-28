import { useState, useEffect } from 'react';
import { CategoryDetail } from '../types';
import { categoryDetails as defaultCategoryDetails } from '../data';
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

  return { categories, loading, addCategory, removeCategory, editCategory };
}
