import { Product, Alternative } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Bamboo Toothbrush Set',
    description: 'Eco-friendly biodegradable bamboo toothbrush set. 100% natural, sustainable, and plastic-free packaging.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop',
    brand: 'EcoHome',
    category: 'Personal Care'
  },
  {
    id: '2',
    name: 'Reusable Stainless Steel Water Bottle',
    description: 'Premium recycled stainless steel bottle. BPA-free, eco-friendly, and keeps drinks cold for 24 hours.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    brand: 'GreenLife',
    category: 'Kitchen'
  },
  {
    id: '3',
    name: 'Disposable Plastic Water Bottles (24 pack)',
    description: 'Convenient single-use plastic bottles. Perfect for parties and events.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
    brand: 'QuickDrink',
    category: 'Beverages'
  },
  {
    id: '4',
    name: 'Organic Cotton Tote Bag',
    description: '100% organic cotton reusable shopping bag. Eco-friendly, biodegradable, and naturally dyed.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    brand: 'EarthBag',
    category: 'Accessories'
  },
  {
    id: '5',
    name: 'Solar Powered Phone Charger',
    description: 'Sustainable solar charger made from recycled materials. Eco-friendly renewable energy on the go.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400&h=400&fit=crop',
    brand: 'SunTech',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Plastic Kitchen Storage Containers',
    description: 'Set of 10 plastic food storage containers with lids. Microwave safe and disposable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400&h=400&fit=crop',
    brand: 'StoreMart',
    category: 'Kitchen'
  },
  {
    id: '7',
    name: 'Recycled Paper Notebook',
    description: 'Beautiful notebook made from 100% recycled paper. Eco-friendly, biodegradable, and plastic-free binding.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
    brand: 'EcoPaper',
    category: 'Stationery'
  },
  {
    id: '8',
    name: 'Natural Beeswax Food Wraps',
    description: 'Organic beeswax wraps - sustainable alternative to plastic wrap. Biodegradable and reusable.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=400&fit=crop',
    brand: 'BeeEco',
    category: 'Kitchen'
  }
];

export const brandScores: Record<string, number> = {
  'EcoHome': 92,
  'GreenLife': 88,
  'QuickDrink': 25,
  'EarthBag': 95,
  'SunTech': 85,
  'StoreMart': 30,
  'EcoPaper': 90,
  'BeeEco': 93
};

export const alternatives: Record<string, Alternative[]> = {
  '3': [
    {
      id: 'alt-1',
      name: 'Stainless Steel Bottle',
      ecoScore: 90,
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop'
    },
    {
      id: 'alt-2',
      name: 'Bamboo Bottle',
      ecoScore: 88,
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200&h=200&fit=crop'
    }
  ],
  '6': [
    {
      id: 'alt-3',
      name: 'Glass Storage Containers',
      ecoScore: 85,
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=200&h=200&fit=crop'
    },
    {
      id: 'alt-4',
      name: 'Bamboo Storage Set',
      ecoScore: 87,
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=200&h=200&fit=crop'
    }
  ]
};
