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
    
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          
          // Sort by ID assuming they are added chronologically or ordered
          fetchedProducts.sort((a, b) => Number(a.id) - Number(b.id));
          setProducts(fetchedProducts);
        } else {
          setProducts(defaultProducts);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore snapshot unavailable, using default catalog:", error);
        setProducts(defaultProducts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      console.warn("Error adding product:", error);
      throw error;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.warn("Error removing product:", error);
      throw error;
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
    } catch (error) {
      console.warn("Error editing product:", error);
      throw error;
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct };
}

