import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Product management
interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  stockCount: number;
  unit: string;
  aisle: string;
  section: string;
  barcode: string;
  description: string;
  image?: string;
  lastUpdated: string;
}

// Mock data - in real app, this would be in database
let products: Product[] = [
  {
    id: 'prod-1',
    name: 'Organic Bananas',
    category: 'Produce',
    brand: 'Fresh Farm',
    price: 2.99,
    inStock: true,
    stockCount: 150,
    unit: 'lb',
    aisle: 'A1',
    section: 'produce',
    barcode: '123456789012',
    description: 'Fresh organic bananas, perfect for snacking',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    brand: 'Baker\'s Choice',
    price: 3.49,
    inStock: true,
    stockCount: 45,
    unit: 'loaf',
    aisle: 'B2',
    section: 'bakery',
    barcode: '123456789013',
    description: 'Fresh baked whole wheat bread',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Organic Milk',
    category: 'Dairy',
    brand: 'Pure Farms',
    price: 4.99,
    inStock: true,
    stockCount: 75,
    unit: 'gallon',
    aisle: 'C3',
    section: 'dairy',
    barcode: '123456789014',
    description: 'Organic whole milk from grass-fed cows',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Premium Ribeye Steak',
    category: 'Meat',
    brand: 'Prime Cuts',
    price: 19.99,
    inStock: true,
    stockCount: 25,
    unit: 'lb',
    aisle: 'D4',
    section: 'meat',
    barcode: '123456789015',
    description: 'Premium cut ribeye steak, aged 21 days',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Frozen Pizza Margherita',
    category: 'Frozen',
    brand: 'Italian Kitchen',
    price: 6.99,
    inStock: false,
    stockCount: 0,
    unit: 'each',
    aisle: 'E5',
    section: 'frozen',
    barcode: '123456789016',
    description: 'Authentic Italian margherita pizza',
    lastUpdated: new Date().toISOString()
  }
];

// GET /api/admin/products - Get all products with optional filtering
router.get('/products', (req: Request, res: Response) => {
  try {
    const { search, category, section, inStock, page = '1', limit = '10' } = req.query;
    
    let filteredProducts = [...products];

    // Apply filters
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (section && section !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.section.toLowerCase() === (section as string).toLowerCase()
      );
    }

    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    } else if (inStock === 'false') {
      filteredProducts = filteredProducts.filter(product => !product.inStock);
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limitNum)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/products/:id - Get single product
router.get('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', (req: Request, res: Response) => {
  try {
    const {
      name, category, brand, price, inStock, stockCount, unit, aisle, section, barcode, description, image
    } = req.body;

    if (!name || !category || !brand || price === undefined || stockCount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, brand, price, and stock count are required'
      });
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      category,
      brand,
      price: parseFloat(price),
      inStock: inStock !== undefined ? inStock : stockCount > 0,
      stockCount: parseInt(stockCount, 10),
      unit: unit || 'each',
      aisle: aisle || '',
      section: section || '',
      barcode: barcode || '',
      description: description || '',
      image,
      lastUpdated: new Date().toISOString()
    };

    products.push(newProduct);

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update numeric fields properly
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }
    if (updates.stockCount !== undefined) {
      updates.stockCount = parseInt(updates.stockCount, 10);
      // Auto-update inStock status based on stock count
      updates.inStock = updates.stockCount > 0;
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    return res.json({
      success: true,
      data: products[productIndex],
      message: 'Product updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/admin/products/bulk-update - Bulk update products
router.post('/products/bulk-update', (req: Request, res: Response) => {
  try {
    const { productIds, updates } = req.body;

    if (!Array.isArray(productIds) || !updates) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array and updates object are required'
      });
    }

    const updatedProducts = [];
    
    for (const productId of productIds) {
      const productIndex = products.findIndex(product => product.id === productId);
      
      if (productIndex !== -1) {
        // Update numeric fields properly
        const processedUpdates = { ...updates };
        if (processedUpdates.price !== undefined) {
          processedUpdates.price = parseFloat(processedUpdates.price);
        }
        if (processedUpdates.stockCount !== undefined) {
          processedUpdates.stockCount = parseInt(processedUpdates.stockCount, 10);
          processedUpdates.inStock = processedUpdates.stockCount > 0;
        }

        products[productIndex] = {
          ...products[productIndex],
          ...processedUpdates,
          lastUpdated: new Date().toISOString()
        };
        
        updatedProducts.push(products[productIndex]);
      }
    }

    return res.json({
      success: true,
      data: updatedProducts,
      message: `${updatedProducts.length} products updated successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to bulk update products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/products/stats - Get product statistics
router.get('/products/stats', (req: Request, res: Response) => {
  try {
    const stats = {
      total: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      lowStock: products.filter(p => p.inStock && p.stockCount < 10).length,
      categories: [...new Set(products.map(p => p.category))].map(category => ({
        name: category,
        count: products.filter(p => p.category === category).length
      })),
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stockCount), 0)
    };

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;