import { Router } from 'express';
import { body } from 'express-validator';
import StoreController from '../controllers/storeController';

const router = Router();

// Validation middleware for store
const storeValidation = [
    body('name').trim().isLength({ min: 1 }).withMessage('Store name is required'),
    body('address.street').trim().isLength({ min: 1 }).withMessage('Street address is required'),
    body('address.city').trim().isLength({ min: 1 }).withMessage('City is required'),
    body('address.state').trim().isLength({ min: 1 }).withMessage('State is required'),
    body('address.zipCode').trim().isLength({ min: 1 }).withMessage('Zip code is required'),
    body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
    body('layout.totalAisles').isInt({ min: 1 }).withMessage('Total aisles must be at least 1'),
    body('layout.aisleLength').isInt({ min: 1 }).withMessage('Aisle length must be at least 1'),
    body('layout.aisleWidth').isInt({ min: 1 }).withMessage('Aisle width must be at least 1'),
    body('layout.storeWidth').isInt({ min: 1 }).withMessage('Store width must be at least 1'),
    body('layout.storeHeight').isInt({ min: 1 }).withMessage('Store height must be at least 1')
];

// Store routes
router.get('/stores', StoreController.getAllStores);
router.get('/stores/:id', StoreController.getStoreById);
router.get('/stores/:id/layout', StoreController.getStoreLayout);

router.post('/stores', storeValidation, StoreController.createStore);
router.put('/stores/:id', storeValidation, StoreController.updateStore);
router.delete('/stores/:id', StoreController.deleteStore);

export default router;