import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('genfocus_products_inr');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('genfocus_products_inr', JSON.stringify(defaultProducts));
    }
  }, []);

  const addProduct = (product: Product) => {
    const newProducts = [product, ...products];
    setProducts(newProducts);
    localStorage.setItem('genfocus_products_inr', JSON.stringify(newProducts));
  };

  const removeProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('genfocus_products_inr', JSON.stringify(newProducts));
  };

  const editProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    localStorage.setItem('genfocus_products_inr', JSON.stringify(newProducts));
  };

  return { products, addProduct, removeProduct, editProduct };
}
