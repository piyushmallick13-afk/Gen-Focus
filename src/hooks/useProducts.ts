import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          defaultProducts.forEach(product => {
            const ref = doc(db, 'products', product.id);
            batch.set(ref, product);
          });
          batch.commit().catch(err => {
            console.warn("Could not auto-seed default products to Firestore:", err);
          });
        } catch (err) {
          console.warn("Could not prepare default products batch:", err);
        }
        setProducts(defaultProducts);
        setLoading(false);
        return;
      }

      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      // Sort by ID assuming they are added chronologically or ordered
      fetchedProducts.sort((a, b) => Number(a.id) - Number(b.id));
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore onSnapshot error, using local products:", error);
      setProducts(defaultProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct };
}

