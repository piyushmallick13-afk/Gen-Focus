import { useState, useEffect } from 'react';
import { CategoryChapter } from '../types';
import { defaultChapters } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

const STORAGE_KEY = 'genfocus_custom_chapters';

export function useChapters() {
  const [chapters, setChapters] = useState<CategoryChapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to default
    }
    return defaultChapters;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chaptersRef = collection(db, 'chapters');

    const unsubscribe = onSnapshot(chaptersRef, async (snapshot) => {
      if (snapshot.empty) {
        // First-time setup: optionally seed Firestore if online
        try {
          const batch = writeBatch(db);
          defaultChapters.forEach((ch, idx) => {
            const docRef = doc(chaptersRef, ch.id.replace(/[^a-zA-Z0-9_-]/g, '_'));
            batch.set(docRef, { ...ch, order: ch.order ?? idx + 1 });
          });
          await batch.commit();
        } catch {
          // ignore if offline or rules prevent
        }
      } else {
        const fetched = snapshot.docs.map(docSnap => ({
          ...docSnap.data()
        } as CategoryChapter));

        // Sort by order or predefined order
        fetched.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        
        // Ensure "All" never has inner chapters even if previously stored
        const sanitized = fetched.map(ch => {
          if (ch.id === 'All') {
            return { ...ch, innerChapters: [] };
          }
          return ch;
        });

        setChapters(sanitized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore listener for chapters failed or offline, using local/default:", error);
      // fallback to current local state
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveLocalAndRemote = async (updatedList: CategoryChapter[]) => {
    // Enforce "All" has no inner chapters
    const sanitized = updatedList.map(ch => {
      if (ch.id === 'All') {
        return { ...ch, innerChapters: [] };
      }
      return ch;
    });

    setChapters(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.warn("Could not save chapters to localStorage:", e);
    }

    try {
      const batch = writeBatch(db);
      sanitized.forEach((ch, idx) => {
        const docKey = ch.id.replace(/[^a-zA-Z0-9_-]/g, '_');
        const docRef = doc(db, 'chapters', docKey);
        batch.set(docRef, { ...ch, order: ch.order ?? idx + 1 });
      });
      await batch.commit();
    } catch (err) {
      console.warn("Could not sync chapters to Firestore:", err);
    }
  };

  const updateChapter = async (id: string, updatedFields: Partial<CategoryChapter>) => {
    const next = chapters.map(ch => {
      if (ch.id === id) {
        return { ...ch, ...updatedFields };
      }
      return ch;
    });
    await saveLocalAndRemote(next);
  };

  const addChapter = async (newChapter: CategoryChapter) => {
    const next = [...chapters, { ...newChapter, order: chapters.length + 1 }];
    await saveLocalAndRemote(next);
  };

  const removeChapter = async (id: string) => {
    if (id === 'All') {
      alert("All Collection cannot be deleted.");
      return;
    }
    const next = chapters.filter(ch => ch.id !== id);
    await saveLocalAndRemote(next);

    try {
      const docKey = id.replace(/[^a-zA-Z0-9_-]/g, '_');
      await deleteDoc(doc(db, 'chapters', docKey));
    } catch (err) {
      console.warn("Could not delete chapter document:", err);
    }
  };

  const resetChapters = async () => {
    await saveLocalAndRemote(defaultChapters);
  };

  return {
    chapters,
    loading,
    updateChapter,
    addChapter,
    removeChapter,
    resetChapters,
    saveLocalAndRemote
  };
}
