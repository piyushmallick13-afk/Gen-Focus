export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  mrp?: string;
  discount?: string;
  imageUrl: string;
  additionalImages?: string[];
  affiliateUrl: string;
  category: string;
  subCategory?: string;
  imageBgColor?: string;
  rating?: number;
  type?: 'affiliate' | 'buy';
  hasSizes?: boolean;
}

export interface CategoryGroup {
  title: string;
  items: string[];
}

export interface CategoryDetail {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  groups: CategoryGroup[];
  popularTags: string[];
  order?: number;
}

export interface NavLink {
  id: string;
  label: string;
  url: string;
  section: 'explore' | 'legal';
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  imageUrl: string;
  quantity: number;
  size?: string;
}
