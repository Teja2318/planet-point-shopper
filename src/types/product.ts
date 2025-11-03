export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
}

export interface EcoScore {
  score: number;
  level: 'high' | 'moderate' | 'low';
  explanation: string;
  keywords: string[];
}

export interface UserStats {
  greenPoints: number;
  co2Saved: number;
  productsViewed: number;
  ecoProductsViewed: number;
  badge: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Alternative {
  id: string;
  name: string;
  ecoScore: number;
  price: number;
  image: string;
}

export interface ProductFeedback {
  productId: string;
  vote: 'up' | 'down';
  comment?: string;
  images: string[];
  timestamp: number;
}
