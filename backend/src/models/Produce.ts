import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation {
    aisle: string;
    section: string;
    shelf: string;
    coordinates?: {
        x: number;
        y: number;
    };
}

export interface IProduce extends Document {
    name: string;
    category: string;
    subcategory?: string;
    price: number;
    location: ILocation;
    stock: number;
    description?: string;
    image?: string;
    barcode?: string;
    brand?: string;
    unit: string; // 'lb', 'kg', 'each', 'bunch', etc.
    nutritionalInfo?: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
    };
    isOrganic: boolean;
    isLocal: boolean;
    seasonality?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema: Schema = new Schema({
    aisle: { type: String, required: true },
    section: { type: String, required: true },
    shelf: { type: String, required: true },
    coordinates: {
        x: { type: Number },
        y: { type: Number }
    }
});

const ProduceSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        required: true,
        enum: ['fruits', 'vegetables', 'herbs', 'organic', 'berries', 'citrus', 'tropical', 'root_vegetables', 'leafy_greens']
    },
    subcategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: LocationSchema, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    barcode: { type: String, trim: true },
    brand: { type: String, trim: true },
    unit: { 
        type: String, 
        required: true, 
        enum: ['lb', 'kg', 'each', 'bunch', 'bag', 'container', 'oz', 'gram']
    },
    nutritionalInfo: {
        calories: { type: Number, min: 0 },
        protein: { type: Number, min: 0 },
        carbs: { type: Number, min: 0 },
        fat: { type: Number, min: 0 },
        fiber: { type: Number, min: 0 }
    },
    isOrganic: { type: Boolean, default: false },
    isLocal: { type: Boolean, default: false },
    seasonality: [{ type: String, enum: ['spring', 'summer', 'fall', 'winter', 'year-round'] }]
}, {
    timestamps: true
});

// Create indexes for better search performance
ProduceSchema.index({ name: 'text', category: 'text', subcategory: 'text' });
ProduceSchema.index({ category: 1 });
ProduceSchema.index({ 'location.aisle': 1 });
ProduceSchema.index({ isOrganic: 1 });
ProduceSchema.index({ stock: 1 });

const Produce = mongoose.model<IProduce>('Produce', ProduceSchema);

export default Produce;