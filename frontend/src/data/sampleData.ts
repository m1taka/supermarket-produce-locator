import { Produce } from '../types';

export const sampleProduceData: Produce[] = [
  {
    _id: '1',
    name: 'Organic Red Apples',
    category: 'fruits',
    subcategory: 'apples',
    price: 2.99,
    location: {
      aisle: 'A1',
      section: 'Fruits',
      shelf: 'A1',
      coordinates: { x: 100, y: 120 }
    },
    stock: 45,
    description: 'Sweet and crispy organic red apples from local orchards',
    image: '/images/red-apples.jpg',
    barcode: '123456789012',
    brand: 'Organic Valley',
    unit: 'lb',
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fat: 0.2,
      fiber: 2.4
    },
    isOrganic: true,
    isLocal: true,
    seasonality: ['fall', 'winter'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Fresh Bananas',
    category: 'fruits',
    subcategory: 'tropical',
    price: 1.49,
    location: {
      aisle: 'A1',
      section: 'Fruits',
      shelf: 'B2',
      coordinates: { x: 150, y: 140 }
    },
    stock: 120,
    description: 'Yellow ripe bananas perfect for smoothies and snacking',
    brand: 'Chiquita',
    unit: 'lb',
    nutritionalInfo: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6
    },
    isOrganic: false,
    isLocal: false,
    seasonality: ['year-round'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Baby Spinach',
    category: 'vegetables',
    subcategory: 'leafy_greens',
    price: 2.99,
    location: {
      aisle: 'A2',
      section: 'Vegetables',
      shelf: 'C1',
      coordinates: { x: 280, y: 130 }
    },
    stock: 32,
    description: 'Fresh tender baby spinach leaves, pre-washed and ready to eat',
    brand: 'Fresh Express',
    unit: 'bag',
    nutritionalInfo: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2
    },
    isOrganic: true,
    isLocal: true,
    seasonality: ['spring', 'fall', 'winter'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '4',
    name: 'Orange Carrots',
    category: 'vegetables',
    subcategory: 'root_vegetables',
    price: 1.79,
    location: {
      aisle: 'A2',
      section: 'Vegetables',
      shelf: 'A3',
      coordinates: { x: 250, y: 160 }
    },
    stock: 85,
    description: 'Fresh crisp orange carrots, perfect for cooking and snacking',
    brand: 'Garden Fresh',
    unit: 'bag',
    nutritionalInfo: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      fiber: 2.8
    },
    isOrganic: false,
    isLocal: true,
    seasonality: ['year-round'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '5',
    name: 'Fresh Basil',
    category: 'herbs',
    subcategory: 'fresh_herbs',
    price: 2.49,
    location: {
      aisle: 'A3',
      section: 'Herbs',
      shelf: 'H1',
      coordinates: { x: 120, y: 180 }
    },
    stock: 18,
    description: 'Aromatic fresh basil leaves, perfect for Italian cooking',
    brand: 'Living Herbs',
    unit: 'container',
    nutritionalInfo: {
      calories: 22,
      protein: 3.2,
      carbs: 2.6,
      fat: 0.6,
      fiber: 1.6
    },
    isOrganic: true,
    isLocal: false,
    seasonality: ['spring', 'summer'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '6',
    name: 'Strawberries',
    category: 'fruits',
    subcategory: 'berries',
    price: 4.99,
    location: {
      aisle: 'A1',
      section: 'Fruits',
      shelf: 'D1',
      coordinates: { x: 180, y: 120 }
    },
    stock: 25,
    description: 'Sweet juicy strawberries, perfect for desserts and snacking',
    brand: 'Berry Fresh',
    unit: 'container',
    nutritionalInfo: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      fiber: 2.0
    },
    isOrganic: true,
    isLocal: true,
    seasonality: ['spring', 'summer'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '7',
    name: 'Organic Kale',
    category: 'vegetables',
    subcategory: 'leafy_greens',
    price: 3.49,
    location: {
      aisle: 'A4',
      section: 'Organic',
      shelf: 'O1',
      coordinates: { x: 240, y: 190 }
    },
    stock: 22,
    description: 'Nutrient-rich organic kale leaves, great for salads and smoothies',
    brand: 'Organic Harvest',
    unit: 'bunch',
    nutritionalInfo: {
      calories: 35,
      protein: 2.9,
      carbs: 7.3,
      fat: 0.4,
      fiber: 3.6
    },
    isOrganic: true,
    isLocal: true,
    seasonality: ['fall', 'winter', 'spring'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '8',
    name: 'Bell Peppers Mix',
    category: 'vegetables',
    subcategory: 'peppers',
    price: 3.99,
    location: {
      aisle: 'A2',
      section: 'Vegetables',
      shelf: 'B4',
      coordinates: { x: 310, y: 145 }
    },
    stock: 0,
    description: 'Colorful mix of red, yellow, and green bell peppers',
    brand: 'Rainbow Farms',
    unit: 'bag',
    nutritionalInfo: {
      calories: 31,
      protein: 1.0,
      carbs: 7.3,
      fat: 0.3,
      fiber: 2.5
    },
    isOrganic: false,
    isLocal: true,
    seasonality: ['summer', 'fall'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];