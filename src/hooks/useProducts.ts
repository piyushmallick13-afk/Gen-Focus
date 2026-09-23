import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

const cleanProduct = (p: Partial<Product>): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v !== undefined) {
      cleaned[k] = v;
    }
  }
  return cleaned;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(productsRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed default products to Firestore if empty
        try {
          const batch = writeBatch(db);
          defaultProducts.forEach(prod => {
            const docRef = doc(productsRef, prod.id);
            batch.set(docRef, cleanProduct(prod));
          });
          await batch.commit();
        } catch (e) {
          console.warn("Could not seed default products to Firestore:", e);
        }
        setProducts(defaultProducts);
        setLoading(false);
      } else {
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        // Sort by ID assuming they are added chronologically or numeric
        fetchedProducts.sort((a, b) => Number(a.id) - Number(b.id));
        setProducts(fetchedProducts);
        setLoading(false);
      }
    }, (error) => {
      console.warn("Firestore products snapshot error, using default products:", error);
      setProducts(defaultProducts);
      setLoading(false);
      try {
        handleFirestoreError(error, OperationType.LIST, 'products');
      } catch {
        // Logged
      }
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), cleanProduct(product));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
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
      await setDoc(doc(db, 'products', updatedProduct.id), cleanProduct(updatedProduct));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${updatedProduct.id}`);
    }
  };

  const resetToDefaults = async () => {
    try {
      const batch = writeBatch(db);
      products.forEach(p => {
        batch.delete(doc(db, 'products', p.id));
      });
      defaultProducts.forEach(prod => {
        const docRef = doc(db, 'products', prod.id);
        batch.set(docRef, cleanProduct(prod));
      });
      await batch.commit();
      setProducts(defaultProducts);
    } catch (error) {
      console.error("Error resetting products:", error);
      setProducts(defaultProducts);
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct, resetToDefaults };
}
