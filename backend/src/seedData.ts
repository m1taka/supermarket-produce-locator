import mongoose from 'mongoose';
import { config } from 'dotenv';
import Produce from './models/Produce';
import Store from './models/Store';

config();

const sampleProduceData = [
    {
        name: 'Organic Bananas',
        category: 'fruits',
        subcategory: 'tropical',
        price: 1.29,
        location: {
            aisle: 'A1',
            section: 'Tropical Fruits',
            shelf: 'B2',
            coordinates: { x: 10, y: 5 }
        },
        stock: 150,
        description: 'Fresh organic bananas from Ecuador',
        brand: 'Nature\'s Best',
        unit: 'lb',
        nutritionalInfo: {
            calories: 105,
            protein: 1.3,
            carbs: 27,
            fat: 0.4,
            fiber: 3.1
        },
        isOrganic: true,
        isLocal: false,
        seasonality: ['year-round']
    },
    {
        name: 'Red Bell Peppers',
        category: 'vegetables',
        subcategory: 'peppers',
        price: 2.99,
        location: {
            aisle: 'A2',
            section: 'Peppers & Onions',
            shelf: 'A1',
            coordinates: { x: 15, y: 8 }
        },
        stock: 75,
        description: 'Crisp red bell peppers',
        unit: 'each',
        nutritionalInfo: {
            calories: 31,
            protein: 1,
            carbs: 7,
            fat: 0.3,
            fiber: 2.5
        },
        isOrganic: false,
        isLocal: true,
        seasonality: ['summer', 'fall']
    },
    {
        name: 'Fresh Spinach',
        category: 'leafy_greens',
        subcategory: 'spinach',
        price: 3.49,
        location: {
            aisle: 'A3',
            section: 'Leafy Greens',
            shelf: 'C1',
            coordinates: { x: 20, y: 12 }
        },
        stock: 45,
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
        seasonality: ['spring', 'fall', 'winter']
    },
    {
        name: 'Honeycrisp Apples',
        category: 'fruits',
        subcategory: 'apples',
        price: 2.99,
        location: {
            aisle: 'A1',
            section: 'Apples',
            shelf: 'A3',
            coordinates: { x: 5, y: 3 }
        },
        stock: 120,
        description: 'Sweet and crispy Honeycrisp apples',
        unit: 'lb',
        nutritionalInfo: {
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            fiber: 4
        },
        isOrganic: false,
        isLocal: true,
        seasonality: ['fall', 'winter']
    },
    {
        name: 'Organic Carrots',
        category: 'root_vegetables',
        subcategory: 'carrots',
        price: 1.99,
        location: {
            aisle: 'A2',
            section: 'Root Vegetables',
            shelf: 'B1',
            coordinates: { x: 12, y: 6 }
        },
        stock: 90,
        description: 'Organic baby carrots',
        brand: 'Earthbound Farm',
        unit: 'bag',
        nutritionalInfo: {
            calories: 41,
            protein: 0.9,
            carbs: 10,
            fat: 0.2,
            fiber: 2.8
        },
        isOrganic: true,
        isLocal: false,
        seasonality: ['year-round']
    },
    {
        name: 'Fresh Blueberries',
        category: 'berries',
        subcategory: 'blueberries',
        price: 4.99,
        location: {
            aisle: 'A1',
            section: 'Berries',
            shelf: 'A1',
            coordinates: { x: 8, y: 2 }
        },
        stock: 30,
        description: 'Fresh organic blueberries',
        unit: 'container',
        nutritionalInfo: {
            calories: 84,
            protein: 1.1,
            carbs: 21,
            fat: 0.5,
            fiber: 3.6
        },
        isOrganic: true,
        isLocal: true,
        seasonality: ['summer']
    }
];

const sampleStoreData = {
    name: 'SuperFresh Market',
    address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA'
    },
    phone: '(555) 123-4567',
    email: 'info@superfreshmarket.com',
    hours: {
        monday: { open: '07:00', close: '22:00', closed: false },
        tuesday: { open: '07:00', close: '22:00', closed: false },
        wednesday: { open: '07:00', close: '22:00', closed: false },
        thursday: { open: '07:00', close: '22:00', closed: false },
        friday: { open: '07:00', close: '23:00', closed: false },
        saturday: { open: '07:00', close: '23:00', closed: false },
        sunday: { open: '08:00', close: '21:00', closed: false }
    },
    layout: {
        totalAisles: 12,
        aisleLength: 120,
        aisleWidth: 8,
        storeWidth: 200,
        storeHeight: 150
    },
    departments: ['produce', 'meat', 'seafood', 'deli', 'bakery', 'dairy', 'frozen', 'pantry', 'beverages', 'health', 'floral']
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-locator');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Produce.deleteMany({});
        await Store.deleteMany({});
        console.log('Cleared existing data');

        // Insert sample data
        const store = await Store.create(sampleStoreData);
        console.log(`Created store: ${store.name}`);

        const produceItems = await Produce.insertMany(sampleProduceData);
        console.log(`Created ${produceItems.length} produce items`);

        console.log('Database seeded successfully!');
        
        // Log sample queries
        console.log('\n--- Sample Data Overview ---');
        console.log('Categories:', await Produce.distinct('category'));
        console.log('Aisles:', await Produce.distinct('location.aisle'));
        console.log('Total items:', await Produce.countDocuments());
        console.log('Organic items:', await Produce.countDocuments({ isOrganic: true }));
        console.log('Local items:', await Produce.countDocuments({ isLocal: true }));

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seed function
seedDatabase();