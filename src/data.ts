import { Product, CategoryDetail } from './types';

export const allCategories = [
  "Women's Fashion",
  "Men's Fashion"
];

export const categoryDetails: Record<string, CategoryDetail> = {
  "Women's Fashion": {
    name: "Women's Fashion",
    tagline: "Refined tailoring, luxurious natural fibers & timeless silhouettes",
    description: "Curated collection of elegant blazers, silk slip dresses, premium knitwear, and handcrafted leather accessories.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Blazers", "Dresses", "Knitwear", "Trousers", "Leather Bags", "Footwear"],
    groups: [
      {
        title: "Outerwear & Tops",
        items: ["Tailored Wool Oversized Blazer", "Pure Mulberry Silk Slip Dress", "Relaxed Cashmere Knit Crewneck", "Structured Linen Shirt"]
      },
      {
        title: "Bottoms & Sets",
        items: ["High-Rise Pleated Wide-Leg Trousers", "A-Line Satin Midi Skirt", "Relaxed Wide-Leg Denims"]
      },
      {
        title: "Bags & Footwear",
        items: ["Handcrafted Leather Shoulder Bag", "Italian Square-Toe Leather Mules", "Minimalist Leather Cardholder"]
      }
    ]
  },
  "Men's Fashion": {
    name: "Men's Fashion",
    tagline: "Elevated menswear, structural tailoring & everyday essentials",
    description: "Contemporary wardrobe staples engineered with clean lines, heavyweight organic cotton, and enduring craftsmanship.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Overshirts", "Knitwear", "Trousers", "Sneakers", "Leather Carry"],
    groups: [
      {
        title: "Outerwear & Tops",
        items: ["Heavyweight Structured Cotton Overshirt", "Extra-Fine Merino Wool Sweater", "Structured Oxford Cotton Relaxed Shirt", "280 GSM Heavyweight Tee"]
      },
      {
        title: "Trousers & Bottoms",
        items: ["Tailored Easy Wool Blend Trousers", "Pleated Straight-Leg Chinos", "Japanese Selvedge Denim"]
      },
      {
        title: "Footwear & Accessories",
        items: ["Clean Minimalist Court Leather Sneakers", "Full-Grain Leather Weekender Bag", "Full-Grain Minimalist Cardholder"]
      }
    ]
  }
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Tailored Wool Oversized Blazer',
    description: 'Double-breasted blazer crafted from premium breathable Italian wool blend. Features soft structured shoulders, horn buttons, and relaxed drape.',
    price: '₹7,999',
    mrp: '₹10,999',
    discount: '27%',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/women-blazer',
    category: "Women's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#F2EFE9]',
    rating: 4.9,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '2',
    name: 'Pure Mulberry Silk Slip Midi Dress',
    description: '19-momme sandwashed mulberry silk slip dress with delicate adjustable straps and a fluid, bias-cut silhouette that drapes gracefully.',
    price: '₹6,499',
    mrp: '₹8,999',
    discount: '28%',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/silk-dress',
    category: "Women's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#ECE8E1]',
    rating: 4.9,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '3',
    name: 'Relaxed Cashmere Knit Crewneck',
    description: 'Luxurious 100% Grade-A Mongolian cashmere knitted with a relaxed gauge for cloud-like softness, lightweight warmth, and thermal comfort.',
    price: '₹8,999',
    mrp: '₹11,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/cashmere-knit',
    category: "Women's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#F5F2ED]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '4',
    name: 'High-Rise Pleated Wide-Leg Trousers',
    description: 'Tailored trousers cut from fluid tropical wool blend featuring sharp front pleats, high-rise waistline, and deep side slant pockets.',
    price: '₹4,499',
    mrp: '₹5,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/women-trousers',
    category: "Women's Fashion",
    subCategory: 'Bottoms & Sets',
    imageBgColor: 'bg-[#F4F0EB]',
    rating: 4.7,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '5',
    name: 'Handcrafted Minimalist Leather Shoulder Bag',
    description: 'Sculptural silhouette formed from smooth full-grain calfskin with custom brushed brass hardware and magnetic closure.',
    price: '₹5,999',
    mrp: '₹7,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/leather-bag',
    category: "Women's Fashion",
    subCategory: 'Bags & Footwear',
    imageBgColor: 'bg-[#ECE8E1]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '6',
    name: 'Italian Nappa Leather Square-Toe Mules',
    description: 'Handcrafted in Italy with buttery soft nappa leather, cushioned memory leather insoles, and a walkable sculpted block heel.',
    price: '₹6,899',
    mrp: '₹8,999',
    discount: '23%',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/leather-mules',
    category: "Women's Fashion",
    subCategory: 'Bags & Footwear',
    imageBgColor: 'bg-[#F2EFEA]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '7',
    name: 'Heavyweight Structured Cotton Overshirt',
    description: '320 GSM organic combed cotton woven with a relaxed structured drape, horn buttons, and twin utilitarian chest pockets.',
    price: '₹4,499',
    mrp: '₹5,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/mens-overshirt',
    category: "Men's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#F2EFEA]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '8',
    name: 'Clean Minimalist Court Leather Sneakers',
    description: 'Handcrafted low-profile sneakers made from supple full-grain Italian nappa leather with recycled margom rubber soles.',
    price: '₹7,499',
    mrp: '₹9,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/court-sneakers',
    category: "Men's Fashion",
    subCategory: 'Footwear & Accessories',
    imageBgColor: 'bg-[#F2F2F2]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '9',
    name: 'Tailored Easy Wool Blend Trousers',
    description: 'Modern straight-leg trousers with an elasticated interior waistband, hidden drawstring, and pressed crease detailing.',
    price: '₹4,999',
    mrp: '₹6,499',
    discount: '23%',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/mens-trousers',
    category: "Men's Fashion",
    subCategory: 'Trousers & Bottoms',
    imageBgColor: 'bg-[#EDEDED]',
    rating: 4.7,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '10',
    name: 'Extra-Fine Merino Wool Sweater',
    description: 'Spun from 19.5-micron Australian extra-fine merino wool. Delivers natural temperature regulation and timeless minimalism.',
    price: '₹5,499',
    mrp: '₹7,299',
    discount: '24%',
    imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/merino-sweater',
    category: "Men's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#EFECE8]',
    rating: 4.9,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '11',
    name: 'Full-Grain Leather Weekender Duffle Bag',
    description: 'Heirloom travel duffle constructed from vegetable-tanned full-grain leather with solid brass YKK hardware and reinforced handles.',
    price: '₹9,499',
    mrp: '₹12,999',
    discount: '27%',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/weekender-bag',
    category: "Men's Fashion",
    subCategory: 'Footwear & Accessories',
    imageBgColor: 'bg-[#EAE8E3]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '12',
    name: 'Structured Oxford Cotton Relaxed Shirt',
    description: 'Substantial 100% long-staple organic cotton Oxford cloth with a classic button-down collar and relaxed tailored silhouette.',
    price: '₹3,899',
    mrp: '₹4,999',
    discount: '22%',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/oxford-shirt',
    category: "Men's Fashion",
    subCategory: 'Outerwear & Tops',
    imageBgColor: 'bg-[#F2EFE9]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  }
];
