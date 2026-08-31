export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  mrp?: string;
  discount?: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  imageBgColor?: string;
  rating?: number;
}

export interface NavLink {
  id: string;
  label: string;
  url: string;
  section: 'explore' | 'legal';
}
