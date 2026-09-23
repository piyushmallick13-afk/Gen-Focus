import { Product, CategoryDetail } from './types';

export const allCategories = [
  "Work & Focus",
  "Sound & Audio",
  "Writing & Carry",
  "Lighting & Ambience",
  "Apparel & Comfort"
];

export const categoryDetails: Record<string, CategoryDetail> = {
  "Work & Focus": {
    name: "Work & Focus",
    tagline: "Ergonomic tools & desk architecture",
    description: "Thoughtful objects engineered to reduce visual friction, encourage clarity, and amplify sustained deep work.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Desk Shelves", "Laptop Stands", "Desk Mats", "Cable Trays"],
    groups: [
      {
        title: "Desk Architecture",
        items: ["Solid Walnut Desk Shelf", "Dual Monitor Risers", "Desk Trays & Catchalls"]
      },
      {
        title: "Ergonomics & Stands",
        items: ["Aluminum Laptop Stands", "Vertical MacBook Docks", "Adjustable Wrist Rests"]
      },
      {
        title: "Surfaces & Cable Control",
        items: ["Merino Wool Desk Mats", "Vegan Leather Desk Pads", "Magnetic Cable Organizers"]
      }
    ]
  },
  "Sound & Audio": {
    name: "Sound & Audio",
    tagline: "Acoustic precision & immersive calm",
    description: "Pure, balanced audio instruments crafted with acoustic warmth, tactile aluminum, and noise-canceling serenity.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Headphones", "Wireless Speakers", "Audio Docks", "Earphones"],
    groups: [
      {
        title: "Personal Listening",
        items: ["Studio Over-Ear Headphones", "Wireless Noise-Canceling Earbuds", "Solid Brass Headphone Stands"]
      },
      {
        title: "Ambient Sound",
        items: ["Cast Aluminum Bluetooth Speaker", "Desktop Acoustic Monitors", "Minimalist Soundbars"]
      }
    ]
  },
  "Writing & Carry": {
    name: "Writing & Carry",
    tagline: "Tactile stationery & durable leather carry",
    description: "Everyday carry essentials and heirloom writing instruments made from solid brass, archival paper, and full-grain leather.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Leather Folios", "Brass Pens", "Notebooks", "Daypacks"],
    groups: [
      {
        title: "Fine Stationery",
        items: ["Machined Brass Rollerball Pen", "Dotted Hardcover Journal", "Fountain Pen Ink & Blotters"]
      },
      {
        title: "Leather Goods & Folios",
        items: ["Full-Grain Leather Folio", "Minimalist Cardholder", "Passport & Travel Wallet"]
      },
      {
        title: "Everyday Carry Bags",
        items: ["Weatherproof Canvas Daypack", "Commuter Briefcase", "Tech Organizer Pouch"]
      }
    ]
  },
  "Lighting & Ambience": {
    name: "Lighting & Ambience",
    tagline: "Warm illumination & sensory calm",
    description: "Sculptural luminaires and aromatic diffusers designed to curate a warm, balanced, and glare-free living atmosphere.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Desk Lamps", "Stone Diffusers", "Accent Lights", "Candle Warmers"],
    groups: [
      {
        title: "Task & Desk Lighting",
        items: ["Matte Black Balance Task Light", "Screenbar Monitor Light", "Brass Pivot Reading Lamp"]
      },
      {
        title: "Sculptural & Mood",
        items: ["Ceramic Table Lamp", "Mushroom Glass Ambient Light", "Rechargeable Lantern"]
      },
      {
        title: "Atmosphere & Fragrance",
        items: ["Concrete Ultrasonic Diffuser", "Ceramic Incense Holder", "Minimalist Scented Soy Candles"]
      }
    ]
  },
  "Apparel & Comfort": {
    name: "Apparel & Comfort",
    tagline: "Effortless silhouettes & premium natural fibers",
    description: "Subtle, unbranded staples crafted from combed organic cotton and fine merino wool for timeless comfort.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    popularTags: ["Overshirts", "Merino Knits", "Heavyweight Tees", "Lounge Trousers"],
    groups: [
      {
        title: "Tops & Layering",
        items: ["Heavyweight Combed Cotton Overshirt", "Merino Wool Crewneck", "280 GSM Structured Tee"]
      },
      {
        title: "Bottoms & Footwear",
        items: ["Tailored Easy Trousers", "Minimalist Court Leather Sneakers", "Felt Wool Indoor Slippers"]
      }
    ]
  }
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Solid Walnut Dual Monitor Desk Shelf',
    description: 'Hand-finished American walnut shelf with integrated aluminum tray. Elevates displays to ergonomic eye level while freeing up desk space.',
    price: '₹6,499',
    mrp: '₹8,999',
    discount: '28%',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/1',
    category: 'Work & Focus',
    subCategory: 'Desk Architecture',
    imageBgColor: 'bg-[#F2EFE9]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '2',
    name: 'Studio Wireless Noise-Canceling Headphones',
    description: 'Precision-tuned 40mm drivers enclosed in matte anodized aluminum and memory foam lambskin ear cushions for pure acoustic tranquility.',
    price: '₹18,999',
    mrp: '₹24,999',
    discount: '24%',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/2',
    category: 'Sound & Audio',
    subCategory: 'Personal Listening',
    imageBgColor: 'bg-[#EDEDED]',
    rating: 4.8,
    type: 'buy'
  },
  {
    id: '3',
    name: 'Machined Solid Brass Rollerball Pen',
    description: 'Seamlessly balanced monolithic brass pen engineered to develop a unique individual patina over decades of daily writing.',
    price: '₹2,499',
    mrp: '₹3,499',
    discount: '29%',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/3',
    category: 'Writing & Carry',
    subCategory: 'Fine Stationery',
    imageBgColor: 'bg-[#F5F2ED]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '4',
    name: 'Sculptural Textured Ceramic Table Lamp',
    description: 'Warm dimmable illumination diffused through a natural linen shade resting atop a hand-thrown textured stoneware base.',
    price: '₹4,999',
    mrp: '₹6,999',
    discount: '28%',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/4',
    category: 'Lighting & Ambience',
    subCategory: 'Sculptural & Mood',
    imageBgColor: 'bg-[#F4F0EB]',
    rating: 4.7,
    type: 'buy'
  },
  {
    id: '5',
    name: 'Full-Grain Leather Work Folio & Notebook',
    description: 'Crafted from vegetable-tanned leather with dedicated pockets for a tablet, brass pen, passport, and A5 refillable dotted journal.',
    price: '₹3,899',
    mrp: '₹5,299',
    discount: '26%',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/5',
    category: 'Writing & Carry',
    subCategory: 'Leather Goods & Folios',
    imageBgColor: 'bg-[#ECE8E1]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '6',
    name: 'Heavyweight Structured Cotton Overshirt',
    description: '320 GSM organic combed cotton woven with a relaxed structured drape, horn buttons, and twin utilitarian chest pockets.',
    price: '₹4,499',
    mrp: '₹5,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/6',
    category: 'Apparel & Comfort',
    subCategory: 'Tops & Layering',
    imageBgColor: 'bg-[#F2EFEA]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  },
  {
    id: '7',
    name: 'Cast Aluminum 360° Portable Speaker',
    description: 'Anodized monolithic aluminum housing with bespoke acoustic fabric. Delivers rich, omnidirectional 360-degree room sound.',
    price: '₹7,999',
    mrp: '₹9,999',
    discount: '20%',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/7',
    category: 'Sound & Audio',
    subCategory: 'Ambient Sound',
    imageBgColor: 'bg-[#EAEAEA]',
    rating: 4.6,
    type: 'buy'
  },
  {
    id: '8',
    name: 'Precision Aluminum Laptop Riser',
    description: 'Bead-blasted architectural grade aluminum stand promoting posture alignment and passive thermal dissipation.',
    price: '₹3,499',
    mrp: '₹4,999',
    discount: '30%',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/8',
    category: 'Work & Focus',
    subCategory: 'Ergonomics & Stands',
    imageBgColor: 'bg-[#EDEDED]',
    rating: 4.8,
    type: 'buy'
  },
  {
    id: '9',
    name: 'Concrete Ultrasonic Aromatherapy Diffuser',
    description: 'Minimalist hand-cast stone shell with whisper-quiet ultrasonic technology to gently vaporize pure essential oils.',
    price: '₹3,299',
    mrp: '₹4,499',
    discount: '27%',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/9',
    category: 'Lighting & Ambience',
    subCategory: 'Atmosphere & Fragrance',
    imageBgColor: 'bg-[#EFECE8]',
    rating: 4.7,
    type: 'buy'
  },
  {
    id: '10',
    name: 'Waterproof Minimalist Canvas Daypack',
    description: 'High-density coated cotton canvas backpack with waterproof matte zippers and a padded 16" protective laptop compartment.',
    price: '₹5,999',
    mrp: '₹7,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/10',
    category: 'Writing & Carry',
    subCategory: 'Everyday Carry Bags',
    imageBgColor: 'bg-[#EAE8E3]',
    rating: 4.8,
    type: 'buy'
  },
  {
    id: '11',
    name: 'Dual-Sided Wool Felt & Leather Desk Pad',
    description: 'High-density pressed German merino wool felt on one side, supple water-resistant vegan leather on reverse for smooth pointer glide.',
    price: '₹2,199',
    mrp: '₹2,999',
    discount: '27%',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/11',
    category: 'Work & Focus',
    subCategory: 'Surfaces & Cable Control',
    imageBgColor: 'bg-[#EDE9E3]',
    rating: 4.9,
    type: 'buy'
  },
  {
    id: '12',
    name: 'Clean Minimalist Court Leather Sneakers',
    description: 'Handcrafted low-profile sneakers made from supple full-grain Italian nappa leather with recycled margom rubber soles.',
    price: '₹7,499',
    mrp: '₹9,999',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    affiliateUrl: 'https://example.com/affiliate/12',
    category: 'Apparel & Comfort',
    subCategory: 'Bottoms & Footwear',
    imageBgColor: 'bg-[#F2F2F2]',
    rating: 4.8,
    type: 'buy',
    hasSizes: true
  }
];
