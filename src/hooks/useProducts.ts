import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const initDocRef = doc(db, 'app_metadata', 'products_init');

    let isMounted = true;

    // Check if initial seeding is needed
    const ensureInitialData = async () => {
      try {
        const initSnap = await getDoc(initDocRef);
        if (!initSnap.exists()) {
          const batch = writeBatch(db);
          defaultProducts.forEach(product => {
            const productRef = doc(db, 'products', product.id);
            const cleanProduct: Record<string, any> = {};
            Object.entries(product).forEach(([k, v]) => {
              if (v !== undefined) {
                cleanProduct[k] = v;
              }
            });
            batch.set(productRef, cleanProduct);
          });
          batch.set(initDocRef, { initialized: true, timestamp: Date.now() });
          await batch.commit();
        }
      } catch (err) {
        console.warn("Could not check/run initial products seed:", err);
      }
    };

    ensureInitialData();

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!isMounted) return;
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        // Sort by ID assuming they are added chronologically or ordered
        fetchedProducts.sort((a, b) => Number(a.id) - Number(b.id));
        setProducts(fetchedProducts);
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.warn("Firestore snapshot unavailable, using default catalog:", error);
        setProducts(defaultProducts);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const cleanProduct: Record<string, any> = {};
      Object.entries(product).forEach(([k, v]) => {
        if (v !== undefined) {
          cleanProduct[k] = v;
        }
      });
      setProducts(prev => {
        const filtered = prev.filter(p => p.id !== cleanProduct.id);
        const next = [...filtered, cleanProduct as Product];
        next.sort((a, b) => Number(a.id) - Number(b.id));
        return next;
      });
      await setDoc(doc(db, 'products', product.id), cleanProduct);
    } catch (error) {
      console.warn("Error adding product:", error);
      throw error;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      // Optimistic removal for immediate feedback
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.warn("Error removing product:", error);
      throw error;
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      const cleanProduct: Record<string, any> = {};
      Object.entries(updatedProduct).forEach(([k, v]) => {
        if (v !== undefined) {
          cleanProduct[k] = v;
        }
      });
      setProducts(prev => prev.map(p => p.id === cleanProduct.id ? cleanProduct as Product : p));
      await setDoc(doc(db, 'products', updatedProduct.id), cleanProduct);
    } catch (error) {
      console.warn("Error editing product:", error);
      throw error;
    }
  };

  const restoreDefaults = async () => {
    try {
      const batch = writeBatch(db);
      defaultProducts.forEach(product => {
        const productRef = doc(db, 'products', product.id);
        const cleanProduct: Record<string, any> = {};
        Object.entries(product).forEach(([k, v]) => {
          if (v !== undefined) {
            cleanProduct[k] = v;
          }
        });
        batch.set(productRef, cleanProduct);
      });
      const initDocRef = doc(db, 'app_metadata', 'products_init');
      batch.set(initDocRef, { initialized: true, timestamp: Date.now() });
      await batch.commit();
    } catch (error) {
      console.warn("Error restoring default products:", error);
      throw error;
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct, restoreDefaults };
}

