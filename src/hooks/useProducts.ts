import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

let hasCheckedSeed = false;

// Helper to remove any undefined properties before writing to Firestore
function sanitizeProduct(product: Product): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(product)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const systemDocRef = doc(db, 'system', 'app_state');

    // Only seed once on initial app deployment if never seeded before
    const checkAndSeed = async () => {
      if (hasCheckedSeed) return;
      hasCheckedSeed = true;

      try {
        const systemSnap = await getDoc(systemDocRef);
        if (!systemSnap.exists()) {
          // System has never been seeded before
          const batch = writeBatch(db);
          defaultProducts.forEach(prod => {
            const docRef = doc(productsRef, prod.id);
            batch.set(docRef, sanitizeProduct(prod));
          });
          batch.set(systemDocRef, { seeded: true, initializedAt: new Date().toISOString() });
          await batch.commit();
        }
      } catch (err) {
        console.error("Initial seeding check error:", err);
      }
    };

    checkAndSeed();

    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Stable sorting: numeric IDs in order, followed by timestamp / string IDs
      fetchedProducts.sort((a, b) => {
        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.id.localeCompare(b.id);
      });

      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const sanitized = sanitizeProduct(product);
      await setDoc(doc(db, 'products', product.id), sanitized);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${product.id}`);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      const sanitized = sanitizeProduct(updatedProduct);
      await setDoc(doc(db, 'products', updatedProduct.id), sanitized);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${updatedProduct.id}`);
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct };
}
