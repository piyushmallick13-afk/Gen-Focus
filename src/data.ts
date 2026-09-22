import { Product } from './types';

export const allCategories = [
  "Men's Fashion",
  "Women's Fashion",
  "Footwear",
  "Accessories"
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Tailored Linen Overshirt',
    description: 'Breathable European linen with a relaxed silhouette for effortless layering.',
    price: '₹5,499',
    mrp: '₹7,999',
    discount: '31%',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/1',
    category: "Men's Fashion",
    imageBgColor: 'bg-[#F4F1EE]',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Pleated Silk Blend Midi Dress',
    description: 'Graceful drape and subtle sheen designed for versatile day-to-evening wear.',
    price: '₹9,999',
    mrp: '₹14,999',
    discount: '33%',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/2',
    category: "Women's Fashion",
    imageBgColor: 'bg-[#EFF2F0]',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Minimalist Leather Derby Shoes',
    description: 'Clean silhouette in supple calfskin with cushioned insoles for everyday elegance.',
    price: '₹6,999',
    mrp: '₹8,999',
    discount: '22%',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/3',
    category: 'Footwear',
    imageBgColor: 'bg-[#F3EFEA]',
    rating: 5
  },
  {
    id: '4',
    name: 'Leather Notebook Folio',
    description: 'Handcrafted full-grain leather to protect your thoughts and ideas.',
    price: '₹3,499',
    mrp: '₹4,999',
    discount: '30%',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/4',
    category: 'Accessories',
    imageBgColor: 'bg-[#EAECEF]',
    rating: 4.9
  },
  {
    id: '5',
    name: 'Classic Wool Knit Sweater',
    description: 'Premium merino wool knit providing warmth with a tailored, modern fit.',
    price: '₹8,999',
    mrp: '₹11,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/5',
    category: "Men's Fashion",
    imageBgColor: 'bg-[#F0EBE6]',
    rating: 4.7
  },
  {
    id: '6',
    name: 'Handcrafted Leather Cardholder',
    description: 'Ultra-slim bi-fold pocket accessory made with durable vegetable-tanned leather.',
    price: '₹2,999',
    mrp: '₹3,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/6',
    category: 'Accessories',
    imageBgColor: 'bg-[#EBF0EF]',
    rating: 4.6
  }
];
