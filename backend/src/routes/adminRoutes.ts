import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Store sections management
interface StoreSection {
  id: string;
  name: string;
  emoji: string;
  color: string;
  textColor: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

// Mock data - in real app, this would be in database
let storeSections: StoreSection[] = [
  { id: 'produce', name: 'Fresh Produce', emoji: '🥬', color: 'bg-green-100 border-green-300', textColor: 'text-green-800', x: 50, y: 50, width: 300, height: 200, visible: true },
  { id: 'bakery', name: 'Bakery', emoji: '🍞', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', x: 370, y: 50, width: 200, height: 120, visible: true },
  { id: 'deli', name: 'Deli', emoji: '🥪', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', x: 590, y: 50, width: 200, height: 120, visible: true },
  { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', color: 'bg-red-100 border-red-300', textColor: 'text-red-800', x: 810, y: 50, width: 200, height: 200, visible: true },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', x: 1030, y: 50, width: 120, height: 300, visible: true },
  { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800', x: 1030, y: 370, width: 120, height: 200, visible: true }
];

// GET /api/admin/sections - Get all store sections
router.get('/sections', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: storeSections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store sections',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/admin/sections - Create new store section
router.post('/sections', (req: Request, res: Response) => {
  try {
    const { name, emoji, color, textColor, x, y, width, height, visible } = req.body;

    if (!name || !emoji) {
      return res.status(400).json({
        success: false,
        message: 'Name and emoji are required'
      });
    }

    const newSection: StoreSection = {
      id: `section-${Date.now()}`,
      name,
      emoji,
      color: color || 'bg-gray-100 border-gray-300',
      textColor: textColor || 'text-gray-800',
      x: x || 100,
      y: y || 100,
      width: width || 200,
      height: height || 150,
      visible: visible !== undefined ? visible : true
    };

    storeSections.push(newSection);

    return res.status(201).json({
      success: true,
      data: newSection,
      message: 'Store section created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create store section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/admin/sections/:id - Update store section
router.put('/sections/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sectionIndex = storeSections.findIndex(section => section.id === id);
    
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Store section not found'
      });
    }

    storeSections[sectionIndex] = { ...storeSections[sectionIndex], ...updates };

    return res.json({
      success: true,
      data: storeSections[sectionIndex],
      message: 'Store section updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update store section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/admin/sections/:id - Delete store section
router.delete('/sections/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sectionIndex = storeSections.findIndex(section => section.id === id);
    
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Store section not found'
      });
    }

    const deletedSection = storeSections.splice(sectionIndex, 1)[0];

    return res.json({
      success: true,
      data: deletedSection,
      message: 'Store section deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete store section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;