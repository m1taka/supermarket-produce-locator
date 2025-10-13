import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Store, { IStore } from '../models/Store';

class StoreController {
    async getAllStores(req: Request, res: Response): Promise<void> {
        try {
            const stores = await Store.find();
            res.status(200).json(stores);
        } catch (error: any) {
            console.error('Error fetching stores:', error);
            res.status(500).json({ message: 'Error fetching stores', error: error.message });
        }
    }

    async getStoreById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const store = await Store.findById(id);
            if (!store) {
                res.status(404).json({ message: 'Store not found' });
                return;
            }
            res.status(200).json(store);
        } catch (error: any) {
            console.error('Error fetching store:', error);
            res.status(500).json({ message: 'Error fetching store', error: error.message });
        }
    }

    async createStore(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation errors', errors: errors.array() });
            return;
        }

        try {
            const newStore = new Store(req.body);
            const savedStore = await newStore.save();
            res.status(201).json(savedStore);
        } catch (error: any) {
            console.error('Error creating store:', error);
            res.status(500).json({ message: 'Error creating store', error: error.message });
        }
    }

    async updateStore(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation errors', errors: errors.array() });
            return;
        }

        try {
            const updatedStore = await Store.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedStore) {
                res.status(404).json({ message: 'Store not found' });
                return;
            }
            res.status(200).json(updatedStore);
        } catch (error: any) {
            console.error('Error updating store:', error);
            res.status(500).json({ message: 'Error updating store', error: error.message });
        }
    }

    async deleteStore(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const deletedStore = await Store.findByIdAndDelete(id);
            if (!deletedStore) {
                res.status(404).json({ message: 'Store not found' });
                return;
            }
            res.status(200).json({ message: 'Store deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting store:', error);
            res.status(500).json({ message: 'Error deleting store', error: error.message });
        }
    }

    async getStoreLayout(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const store = await Store.findById(id).select('layout departments name');
            if (!store) {
                res.status(404).json({ message: 'Store not found' });
                return;
            }
            res.status(200).json(store);
        } catch (error: any) {
            console.error('Error fetching store layout:', error);
            res.status(500).json({ message: 'Error fetching store layout', error: error.message });
        }
    }
}

export default new StoreController();