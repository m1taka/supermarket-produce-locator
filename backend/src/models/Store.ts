import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    phone: string;
    email?: string;
    hours: {
        [key: string]: {
            open: string;
            close: string;
            closed?: boolean;
        };
    };
    layout: {
        totalAisles: number;
        aisleLength: number;
        aisleWidth: number;
        storeWidth: number;
        storeHeight: number;
    };
    departments: string[];
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: 'USA', trim: true }
});

const HoursSchema: Schema = new Schema({
    monday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    tuesday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    wednesday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    thursday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    friday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    saturday: {
        open: { type: String, default: '08:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false }
    },
    sunday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '21:00' },
        closed: { type: Boolean, default: false }
    }
});

const LayoutSchema: Schema = new Schema({
    totalAisles: { type: Number, required: true, min: 1 },
    aisleLength: { type: Number, required: true, min: 1 }, // in feet
    aisleWidth: { type: Number, required: true, min: 1 }, // in feet
    storeWidth: { type: Number, required: true, min: 1 }, // in feet
    storeHeight: { type: Number, required: true, min: 1 } // in feet
});

const StoreSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    address: { type: AddressSchema, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    hours: { type: HoursSchema, required: true },
    layout: { type: LayoutSchema, required: true },
    departments: [{ 
        type: String, 
        enum: ['produce', 'meat', 'seafood', 'deli', 'bakery', 'dairy', 'frozen', 'pantry', 'beverages', 'health', 'pharmacy', 'floral']
    }]
}, {
    timestamps: true
});

const Store = mongoose.model<IStore>('Store', StoreSchema);

export default Store;