import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Produce from '../src/models/Produce';
import Store from '../src/models/Store';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-locator';

// Sample produce data
const sampleProduce = [
  {
    name: 'Organic Bananas',
    category: 'fruits',
    subcategory: 'tropical',
    price: 1.99,
    location: {
      aisle: 'A1',
      section: 'Tropical Fruits',
      shelf: 'B',
      coordinates: { x: 50, y: 25 }
    },
    stock: 120,
    description: 'Fresh organic bananas from Ecuador',
    brand: 'Nature\'s Best',
    unit: 'lb',
    nutritionalInfo: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6
    },
    isOrganic: true,
    isLocal: false,
    seasonality: ['year-round'],
    barcode: '123456789012'
  },
  {
    name: 'Fresh Spinach',
    category: 'vegetables',
    subcategory: 'leafy_greens',
    price: 2.49,
    location: {
      aisle: 'A2',
      section: 'Leafy Greens',
      shelf: 'A',
      coordinates: { x: 75, y: 45 }
    },
    stock: 85,
    description: 'Fresh baby spinach leaves',
    brand: 'Green Valley',
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
    barcode: '123456789013'
  },
  {
    name: 'Red Bell Peppers',
    category: 'vegetables',
    subcategory: 'peppers',
    price: 3.99,
    location: {
      aisle: 'A2',
      section: 'Bell Peppers',
      shelf: 'C',
      coordinates: { x: 100, y: 65 }
    },
    stock: 60,
    description: 'Sweet red bell peppers',
    brand: 'Farm Fresh',
    unit: 'lb',
    nutritionalInfo: {
      calories: 37,
      protein: 1.2,
      carbs: 7,
      fat: 0.3,
      fiber: 2.5
    },
    isOrganic: false,
    isLocal: true,
    seasonality: ['summer', 'fall'],
    barcode: '123456789014'
  },
  {
    name: 'Gala Apples',
    category: 'fruits',
    subcategory: 'apples',
    price: 2.99,
    location: {
      aisle: 'A1',
      section: 'Apples',
      shelf: 'A',
      coordinates: { x: 25, y: 15 }
    },
    stock: 200,
    description: 'Sweet and crisp Gala apples',
    brand: 'Orchard Pride',
    unit: 'lb',
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fat: 0.2,
      fiber: 2.4
    },
    isOrganic: false,
    isLocal: true,
    seasonality: ['fall', 'winter'],
    barcode: '123456789015'
  },
  {
    name: 'Fresh Basil',
    category: 'herbs',
    subcategory: 'fresh_herbs',
    price: 1.99,
    location: {
      aisle: 'A3',
      section: 'Fresh Herbs',
      shelf: 'A',
      coordinates: { x: 125, y: 20 }
    },
    stock: 45,
    description: 'Fresh basil leaves',
    brand: 'Herb Garden',
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
    barcode: '123456789016'
  },
  {
    name: 'Strawberries',
    category: 'fruits',
    subcategory: 'berries',
    price: 4.99,
    location: {
      aisle: 'A1',
      section: 'Berries',
      shelf: 'C',
      coordinates: { x: 80, y: 35 }
    },
    stock: 35,
    description: 'Sweet fresh strawberries',
    brand: 'Berry Best',
    unit: 'container',
    nutritionalInfo: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      fiber: 2
    },
    isOrganic: true,
    isLocal: true,
    seasonality: ['spring', 'summer'],
    barcode: '123456789017'
  },
  {
    name: 'Carrots',
    category: 'vegetables',
    subcategory: 'root_vegetables',
    price: 1.79,
    location: {
      aisle: 'A2',
      section: 'Root Vegetables',
      shelf: 'B',
      coordinates: { x: 150, y: 55 }
    },
    stock: 90,
    description: 'Fresh orange carrots',
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
    barcode: '123456789018'
  },
  {
    name: 'Navel Oranges',
    category: 'fruits',
    subcategory: 'citrus',
    price: 3.49,
    location: {
      aisle: 'A1',
      section: 'Citrus',
      shelf: 'D',
      coordinates: { x: 175, y: 25 }
    },
    stock: 150,
    description: 'Juicy navel oranges',
    brand: 'Sunny Grove',
    unit: 'lb',
    nutritionalInfo: {
      calories: 47,
      protein: 0.9,
      carbs: 11.8,
      fat: 0.1,
      fiber: 2.4
    },
    isOrganic: false,
    isLocal: false,
    seasonality: ['winter', 'spring'],
    barcode: '123456789019'
  }
];

// Sample store data
const sampleStore = {
  name: 'Downtown Fresh Market',
  address: {
    street: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'USA'
  },
  phone: '+1 (555) 123-4567',
  email: 'info@downtownfresh.com',
  hours: {
    monday: { open: '7:00 AM', close: '10:00 PM' },
    tuesday: { open: '7:00 AM', close: '10:00 PM' },
    wednesday: { open: '7:00 AM', close: '10:00 PM' },
    thursday: { open: '7:00 AM', close: '10:00 PM' },
    friday: { open: '7:00 AM', close: '11:00 PM' },
    saturday: { open: '7:00 AM', close: '11:00 PM' },
    sunday: { open: '8:00 AM', close: '9:00 PM' }
  },
  layout: {
    totalAisles: 12,
    aisleLength: 200,
    aisleWidth: 8,
    storeWidth: 300,
    storeHeight: 150
  },
  departments: [
    'Produce',
    'Meat & Seafood',
    'Dairy',
    'Frozen Foods',
    'Bakery',
    'Deli',
    'Pharmacy',
    'General Merchandise'
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Produce.deleteMany({});
    await Store.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert sample store
    const store = new Store(sampleStore);
    await store.save();
    console.log('🏪 Store data seeded');

    // Insert sample produce
    await Produce.insertMany(sampleProduce);
    console.log('🥬 Produce data seeded');

    // Create indexes for better search performance
    await Produce.createIndexes();
    await Store.createIndexes();
    console.log('📇 Indexes created');

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Inserted ${sampleProduce.length} produce items and 1 store`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };