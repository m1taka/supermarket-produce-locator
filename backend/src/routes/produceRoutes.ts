import { Router } from 'express';
import { body } from 'express-validator';
import ProduceController from '../controllers/produceController';

const router = Router();

// Validation middleware
const produceValidation = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('category').isIn(['fruits', 'vegetables', 'herbs', 'organic', 'berries', 'citrus', 'tropical', 'root_vegetables', 'leafy_greens'])
        .withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('unit').isIn(['lb', 'kg', 'each', 'bunch', 'bag', 'container', 'oz', 'gram'])
        .withMessage('Invalid unit'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('location.aisle').trim().isLength({ min: 1 }).withMessage('Aisle is required'),
    body('location.section').trim().isLength({ min: 1 }).withMessage('Section is required'),
    body('location.shelf').trim().isLength({ min: 1 }).withMessage('Shelf is required')
];

// Produce routes
router.get('/produce', ProduceController.getAllProduce);
router.get('/produce/search', ProduceController.searchProduce);
router.get('/produce/categories', ProduceController.getCategories);
router.get('/produce/low-stock', ProduceController.getLowStockItems);
router.get('/produce/location/:aisle', ProduceController.getProduceByLocation);
router.get('/produce/location/:aisle/:section', ProduceController.getProduceByLocation);
router.get('/produce/:id', ProduceController.getProduceById);

router.post('/produce', produceValidation, ProduceController.createProduce);
router.put('/produce/:id', produceValidation, ProduceController.updateProduce);
router.patch('/produce/:id/stock', ProduceController.updateStock);
router.delete('/produce/:id', ProduceController.deleteProduce);

export default router;