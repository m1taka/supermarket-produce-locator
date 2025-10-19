import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import produceRoutes from './routes/produceRoutes';
import storeRoutes from './routes/storeRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';

config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-locator');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Supermarket Locator API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes
app.use('/api', produceRoutes);
app.use('/api', storeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', productRoutes);

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        const errorMessages = err.errors ? 
            Object.keys(err.errors).map(key => err.errors[key].message) : 
            ['Validation failed'];
        res.status(400).json({
            message: 'Validation Error',
            errors: errorMessages
        });
        return;
    }
    
    if (err.name === 'CastError') {
        res.status(400).json({
            message: 'Invalid ID format'
        });
        return;
    }
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close().then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/health`);
});

export default app;