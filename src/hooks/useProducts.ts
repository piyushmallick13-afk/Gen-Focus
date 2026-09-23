import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';

const STORAGE_KEY = 'genfocus_products_v3';

function loadInitialProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load products from localStorage:', err);
  }
  return defaultProducts;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadInitialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save products to localStorage:', err);
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const editProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const resetToDefaults = () => {
    setProducts(defaultProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    } catch (err) {
      console.error('Failed to reset products in localStorage:', err);
    }
  };

  return { products, loading, addProduct, removeProduct, editProduct, resetToDefaults };
}
