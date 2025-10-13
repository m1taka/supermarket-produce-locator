import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Produce, { IProduce } from '../models/Produce';
import { getErrorMessage, handleControllerError } from '../utils/errorHandler';

interface QueryParams {
    page?: string;
    limit?: string;
    category?: string;
    aisle?: string;
    search?: string;
    inStock?: string;
    organic?: string;
    local?: string;
    sortBy?: string;
    sortOrder?: string;
}

class ProduceController {
    async getAllProduce(req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> {
        try {
            const {
                page = '1',
                limit = '20',
                category,
                aisle,
                search,
                inStock,
                organic,
                local,
                sortBy = 'name',
                sortOrder = 'asc'
            } = req.query;

            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            // Build filter object
            const filter: any = {};
            
            if (category) filter.category = category;
            if (aisle) filter['location.aisle'] = aisle;
            if (inStock === 'true') filter.stock = { $gt: 0 };
            if (organic === 'true') filter.isOrganic = true;
            if (local === 'true') filter.isLocal = true;
            
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { subcategory: { $regex: search, $options: 'i' } },
                    { brand: { $regex: search, $options: 'i' } }
                ];
            }

            // Build sort object
            const sort: any = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const produceItems = await Produce.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum);

            const total = await Produce.countDocuments(filter);
            const totalPages = Math.ceil(total / limitNum);

            res.status(200).json({
                items: produceItems,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: total,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            });
        } catch (error) {
            console.error('Error fetching produce items:', error);
            handleControllerError(res, error, 'Error fetching produce items');
        }
    }

    async getProduceById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const produceItem = await Produce.findById(id);
            if (!produceItem) {
                res.status(404).json({ message: 'Produce item not found' });
                return;
            }
            res.status(200).json(produceItem);
        } catch (error) {
            handleControllerError(res, error, 'Error fetching produce item');
        }
    }

    async searchProduce(req: Request, res: Response): Promise<void> {
        const { query, limit = '10' } = req.query;
        
        if (!query) {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }

        try {
            const produceItems = await Produce.find({
                $text: { $search: query as string }
            }, {
                score: { $meta: 'textScore' }
            })
            .sort({ score: { $meta: 'textScore' } })
            .limit(parseInt(limit as string));

            res.status(200).json(produceItems);
        } catch (error) {
            handleControllerError(res, error, 'Error searching produce');
        }
    }

    async getProduceByLocation(req: Request, res: Response): Promise<void> {
        const { aisle, section } = req.params;
        
        try {
            const filter: any = { 'location.aisle': aisle };
            if (section) filter['location.section'] = section;

            const produceItems = await Produce.find(filter).sort({ 'location.shelf': 1, name: 1 });
            res.status(200).json(produceItems);
        } catch (error) {
            handleControllerError(res, error, 'Error fetching produce by location');
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await Produce.distinct('category');
            const aisles = await Produce.distinct('location.aisle');
            
            res.status(200).json({
                categories: categories.sort(),
                aisles: aisles.sort()
            });
        } catch (error) {
            handleControllerError(res, error, 'Error fetching categories');
        }
    }

    async createProduce(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation errors', errors: errors.array() });
            return;
        }

        try {
            const newProduce = new Produce(req.body);
            const savedProduce = await newProduce.save();
            res.status(201).json(savedProduce);
        } catch (error) {
            handleControllerError(res, error, 'Error creating produce item');
        }
    }

    async updateProduce(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation errors', errors: errors.array() });
            return;
        }

        try {
            const updatedProduce = await Produce.findByIdAndUpdate(
                id, 
                req.body, 
                { new: true, runValidators: true }
            );
            if (!updatedProduce) {
                res.status(404).json({ message: 'Produce item not found' });
                return;
            }
            res.status(200).json(updatedProduce);
        } catch (error) {
            handleControllerError(res, error, 'Error updating produce item');
        }
    }

    async updateStock(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            res.status(400).json({ message: 'Invalid stock value' });
            return;
        }

        try {
            const updatedProduce = await Produce.findByIdAndUpdate(
                id,
                { stock },
                { new: true }
            );
            
            if (!updatedProduce) {
                res.status(404).json({ message: 'Produce item not found' });
                return;
            }
            
            res.status(200).json(updatedProduce);
        } catch (error) {
            handleControllerError(res, error, 'Error updating stock');
        }
    }

    async deleteProduce(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const deletedProduce = await Produce.findByIdAndDelete(id);
            if (!deletedProduce) {
                res.status(404).json({ message: 'Produce item not found' });
                return;
            }
            res.status(200).json({ message: 'Produce item deleted successfully' });
        } catch (error) {
            handleControllerError(res, error, 'Error deleting produce item');
        }
    }

    async getLowStockItems(req: Request, res: Response): Promise<void> {
        const { threshold = '10' } = req.query;
        
        try {
            const lowStockItems = await Produce.find({
                stock: { $lte: parseInt(threshold as string) }
            }).sort({ stock: 1 });

            res.status(200).json(lowStockItems);
        } catch (error) {
            handleControllerError(res, error, 'Error fetching low stock items');
        }
    }
}

export default new ProduceController();