import { Product, CategoryDetail } from './types';

export const allCategories = [
  "Men's Fashion",
  "Women's Fashion",
  "Accessories"
];

export const categoryDetails: Record<string, CategoryDetail> = {
  "Men's Fashion": {
    name: "Men's Fashion",
    tagline: 'Timeless tailoring & modern relaxed essentials',
    description: 'Minimalist menswear tailored from breathable Belgian linen, Italian virgin wool, and structured organic cottons designed for enduring style.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    popularTags: ['Linen Shirts', 'Overshirts', 'Trench Coats', 'Tailored Trousers', 'Knitwear'],
    groups: [
      {
        title: 'Apparel',
        items: ['Linen Shirts', 'Overshirts', 'Trench Coats', 'Tailored Trousers', 'Knitwear']
      },
      {
        title: 'Curated Collections',
        items: ['Warm Weather Staples', 'Modern Workwear', 'Everyday Minimal', 'Outerwear Essentials']
      },
      {
        title: 'Premium Materials',
        items: ['Belgian Linen', 'Italian Wool', 'Combed Cotton', 'Merino Blends']
      }
    ]
  },
  "Women's Fashion": {
    name: "Women's Fashion",
    tagline: 'Fluid silhouettes & understated elegance',
    description: 'Thoughtfully designed wardrobe staples cut from silk blends, Mongolian cashmere, and structured linens offering seamless versatility from day to night.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    popularTags: ['Wrap Dresses', 'Cashmere Knitwear', 'Silk Tops', 'Pleated Skirts', 'Blazers'],
    groups: [
      {
        title: 'Apparel',
        items: ['Wrap Dresses', 'Cashmere Knitwear', 'Silk Tops', 'Tailored Pants', 'Outerwear']
      },
      {
        title: 'Occasions & Themes',
        items: ['Capsule Wardrobe', 'Day to Evening', 'Weekend Getaway', 'Elevated Casual']
      },
      {
        title: 'Finest Fabrics',
        items: ['Silk Crepe', 'Pure Cashmere', 'Structured Cotton', 'Ribbed Weaves']
      }
    ]
  },
  "Accessories": {
    name: 'Accessories',
    tagline: 'Precision horology & handcrafted leather goods',
    description: 'Artisanal timepieces, full-grain leather notebooks, wallets, and minimalist lifestyle companions built to endure a lifetime of daily use.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    popularTags: ['Leather Watches', 'Notebook Folios', 'Cardholders', 'Bags & Folios', 'Minimal Wallets'],
    groups: [
      {
        title: 'Watches & Timepieces',
        items: ['Leather Watches', 'Minimalist Chronographs', 'Automatic Watches', 'Watch Straps']
      },
      {
        title: 'Leather Goods',
        items: ['Notebook Folios', 'Cardholders', 'Classic Wallets', 'Passport Sleeves']
      },
      {
        title: 'Everyday Objects',
        items: ['Eyewear & Sunglasses', 'Brass Accents', 'Key Organizers', 'Desk Accessories']
      }
    ]
  }
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Tailored Linen Overshirt',
    description: 'Minimalist relaxed silhouette cut from premium breathable Belgian linen.',
    price: '₹4,499',
    mrp: '₹6,999',
    discount: '35%',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/1',
    category: "Men's Fashion",
    imageBgColor: 'bg-[#F4F1EE]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '2',
    name: 'Silk Blend Midi Wrap Dress',
    description: 'Effortless drape and understated elegance for day-to-night versatility.',
    price: '₹5,999',
    mrp: '₹8,999',
    discount: '33%',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/2',
    category: "Women's Fashion",
    imageBgColor: 'bg-[#EFF2F0]',
    rating: 4.9,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '3',
    name: 'Handcrafted Minimalist Leather Watch',
    description: 'Precision Japanese movement encased in brushed surgical-grade stainless steel with Italian leather strap.',
    price: '₹8,499',
    mrp: '₹11,999',
    discount: '29%',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/3',
    category: 'Accessories',
    imageBgColor: 'bg-[#F3EFEA]',
    rating: 5,
    type: 'buy'
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
    rating: 4.9,
    type: 'affiliate'
  },
  {
    id: '5',
    name: 'Structured Wool Trench Coat',
    description: 'Double-breasted timeless outerwear crafted from fine Italian virgin wool blend.',
    price: '₹12,999',
    mrp: '₹17,999',
    discount: '28%',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/5',
    category: "Men's Fashion",
    imageBgColor: 'bg-[#F0EBE6]',
    rating: 4.7,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '6',
    name: 'Ribbed Cashmere Knit Sweater',
    description: 'Plush Mongolian cashmere knit with an easy mock-neck silhouette.',
    price: '₹6,499',
    mrp: '₹9,499',
    discount: '31%',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/6',
    category: "Women's Fashion",
    imageBgColor: 'bg-[#EBF0EF]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  }
];
