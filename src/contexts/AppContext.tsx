import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, CartItem, Product, ProductFeedback } from '@/types/product';

interface AppContextType {
  stats: UserStats;
  updateStats: (points: number, co2: number, isEco: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  ecoPreference: number;
  setEcoPreference: (value: number) => void;
  productFeedbacks: ProductFeedback[];
  submitFeedback: (feedback: ProductFeedback) => void;
  getFeedbackForProduct: (productId: string) => ProductFeedback | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STATS: 'ecoshopper_stats',
  CART: 'ecoshopper_cart',
  THEME: 'ecoshopper_theme',
  PREFERENCE: 'ecoshopper_preference',
  FEEDBACK: 'ecoshopper_feedbacks'
};

const defaultStats: UserStats = {
  greenPoints: 0,
  co2Saved: 0,
  productsViewed: 0,
  ecoProductsViewed: 0,
  badge: '🌱 Eco Beginner'
};

function getBadge(ecoProductsViewed: number): string {
  if (ecoProductsViewed >= 25) return '🌎 Planet Saver';
  if (ecoProductsViewed >= 10) return '🌿 Green Hero';
  return '🌱 Eco Beginner';
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  });

  const [ecoPreference, setEcoPreference] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCE);
    return saved ? parseInt(saved) : 50;
  });

  const [productFeedbacks, setProductFeedbacks] = useState<ProductFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCE, ecoPreference.toString());
  }, [ecoPreference]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(productFeedbacks));
  }, [productFeedbacks]);

  const updateStats = (points: number, co2: number, isEco: boolean) => {
    setStats(prev => {
      const newEcoCount = isEco ? prev.ecoProductsViewed + 1 : prev.ecoProductsViewed;
      return {
        greenPoints: prev.greenPoints + points,
        co2Saved: prev.co2Saved + co2,
        productsViewed: prev.productsViewed + 1,
        ecoProductsViewed: newEcoCount,
        badge: getBadge(newEcoCount)
      };
    });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const submitFeedback = (feedback: ProductFeedback) => {
    setProductFeedbacks(prev => {
      const filtered = prev.filter(f => f.productId !== feedback.productId);
      return [...filtered, feedback];
    });
  };

  const getFeedbackForProduct = (productId: string) => {
    return productFeedbacks.find(f => f.productId === productId);
  };

  return (
    <AppContext.Provider
      value={{
        stats,
        updateStats,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        theme,
        toggleTheme,
        ecoPreference,
        setEcoPreference,
        productFeedbacks,
        submitFeedback,
        getFeedbackForProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
