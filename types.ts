export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  story: string; // The storytelling part
  specs: Record<string, string>;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  features: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
