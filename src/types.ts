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
  imageBgColor?: string;
  rating?: number;
  type?: 'affiliate' | 'buy';
  hasSizes?: boolean;
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

export interface CategoryGroup {
  title: string;
  items: string[];
}

export interface CategoryDetail {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  slug?: string;
  itemCount?: number;
  order?: number;
  popularTags?: string[];
  groups?: CategoryGroup[];
}

export interface InnerChapter {
  id?: string;
  name: string;
  query?: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryChapter {
  id: string;
  name: string;
  description?: string;
  order?: number;
  imageUrl?: string;
  innerChapters?: (InnerChapter | string)[];
}
