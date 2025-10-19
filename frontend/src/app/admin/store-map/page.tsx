'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PlusIcon, MinusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';

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

interface DragState {
  isDragging: boolean;
  draggedSection: string | null;
  dragOffset: { x: number; y: number };
  isResizing: boolean;
  resizeHandle: string | null;
  isCreatingNew: boolean;
  newSectionTemplate: Partial<StoreSection> | null;
}

interface ResizeHandle {
  id: string;
  cursor: string;
  position: { x: number; y: number };
}

// localStorage helper functions
const STORAGE_KEY = 'store-map-sections';
const HISTORY_STORAGE_KEY = 'store-map-history';

const saveToLocalStorage = (sections: StoreSection[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const saveHistoryToLocalStorage = (history: StoreSection[][], historyIndex: number) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify({ history, historyIndex }));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
};

const loadFromLocalStorage = (): StoreSection[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

const loadHistoryFromLocalStorage = (): { history: StoreSection[][], historyIndex: number } | null => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading history from localStorage:', error);
  }
  return null;
};

const getDefaultSections = (): StoreSection[] => [
  { id: 'produce', name: 'Fresh Produce', emoji: '🥬', color: 'bg-green-100 border-green-300', textColor: 'text-green-800', x: 50, y: 50, width: 300, height: 200, visible: true },
  { id: 'bakery', name: 'Bakery', emoji: '🍞', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', x: 370, y: 50, width: 200, height: 120, visible: true },
  { id: 'deli', name: 'Deli', emoji: '🥪', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', x: 590, y: 50, width: 200, height: 120, visible: true },
  { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', color: 'bg-red-100 border-red-300', textColor: 'text-red-800', x: 810, y: 50, width: 200, height: 200, visible: true },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', x: 1030, y: 50, width: 120, height: 300, visible: true },
  { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800', x: 1030, y: 370, width: 120, height: 200, visible: true }
];

// History management helper functions
const MAX_HISTORY_SIZE = 50;

const addToHistory = (
  sections: StoreSection[], 
  history: StoreSection[][], 
  historyIndex: number,
  setHistory: (history: StoreSection[][]) => void,
  setHistoryIndex: (index: number) => void
) => {
  // Remove any future history if we're not at the end
  const newHistory = history.slice(0, historyIndex + 1);
  
  // Add the new state
  newHistory.push(JSON.parse(JSON.stringify(sections))); // Deep clone
  
  // Limit history size
  if (newHistory.length > MAX_HISTORY_SIZE) {
    newHistory.shift();
  } else {
    setHistoryIndex(historyIndex + 1);
  }
  
  setHistory(newHistory);
  if (newHistory.length <= MAX_HISTORY_SIZE) {
    setHistoryIndex(newHistory.length - 1);
  }
};

export default function StoreMapEditor() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [sections, setSections] = useState<StoreSection[]>(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedSections = loadFromLocalStorage();
      return savedSections || getDefaultSections();
    }
    return getDefaultSections();
  });

  // History management for undo/redo
  const [history, setHistory] = useState<StoreSection[][]>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = loadHistoryFromLocalStorage();
      if (savedHistory) {
        return savedHistory.history;
      }
    }
    const initialSections = typeof window !== 'undefined' 
      ? loadFromLocalStorage() || getDefaultSections()
      : getDefaultSections();
    return [initialSections];
  });
  const [historyIndex, setHistoryIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = loadHistoryFromLocalStorage();
      if (savedHistory) {
        return savedHistory.historyIndex;
      }
    }
    return 0;
  });

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedSection: null,
    dragOffset: { x: 0, y: 0 },
    isResizing: false,
    resizeHandle: null,
    isCreatingNew: false,
    newSectionTemplate: null
  });

  const [dragJustCompleted, setDragJustCompleted] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    name: '',
    emoji: '📦',
    color: 'bg-gray-100 border-gray-300',
    textColor: 'text-gray-800'
  });

  const [showAllSections, setShowAllSections] = useState(false);
  const [showAddedSections, setShowAddedSections] = useState(true);

  // Predefined color themes
  const colorThemes = [
    { color: 'bg-green-100 border-green-300', textColor: 'text-green-800', name: 'Green' },
    { color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', name: 'Blue' },
    { color: 'bg-red-100 border-red-300', textColor: 'text-red-800', name: 'Red' },
    { color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', name: 'Yellow' },
    { color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', name: 'Orange' },
    { color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800', name: 'Purple' },
    { color: 'bg-pink-100 border-pink-300', textColor: 'text-pink-800', name: 'Pink' },
    { color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800', name: 'Cyan' }
  ];

  // Predefined section templates
  const sectionTemplates = [
    { name: 'Fresh Produce', emoji: '🥬', color: 'bg-green-100 border-green-300', textColor: 'text-green-800' },
    { name: 'Bakery', emoji: '🍞', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800' },
    { name: 'Deli', emoji: '🥪', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800' },
    { name: 'Meat & Seafood', emoji: '🥩', color: 'bg-red-100 border-red-300', textColor: 'text-red-800' },
    { name: 'Dairy & Eggs', emoji: '🥛', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800' },
    { name: 'Frozen Foods', emoji: '🧊', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800' },
    { name: 'Beverages', emoji: '🥤', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800' },
    { name: 'Snacks', emoji: '🍿', color: 'bg-pink-100 border-pink-300', textColor: 'text-pink-800' },
    { name: 'Health & Beauty', emoji: '💊', color: 'bg-indigo-100 border-indigo-300', textColor: 'text-indigo-800' },
    { name: 'Household', emoji: '🧽', color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-800' },
    { name: 'Electronics', emoji: '📱', color: 'bg-slate-100 border-slate-300', textColor: 'text-slate-800' },
    { name: 'Pet Supplies', emoji: '🐕', color: 'bg-amber-100 border-amber-300', textColor: 'text-amber-800' },
    { name: 'Baby Care', emoji: '👶', color: 'bg-rose-100 border-rose-300', textColor: 'text-rose-800' },
    { name: 'Pharmacy', emoji: '💉', color: 'bg-emerald-100 border-emerald-300', textColor: 'text-emerald-800' },
    { name: 'Flowers', emoji: '🌸', color: 'bg-fuchsia-100 border-fuchsia-300', textColor: 'text-fuchsia-800' },
    { name: 'Auto Care', emoji: '🔧', color: 'bg-zinc-100 border-zinc-300', textColor: 'text-zinc-800' },
    { name: 'Garden Center', emoji: '🌱', color: 'bg-lime-100 border-lime-300', textColor: 'text-lime-800' },
    { name: 'Customer Service', emoji: '🎧', color: 'bg-sky-100 border-sky-300', textColor: 'text-sky-800' },
    { name: 'Checkout', emoji: '💳', color: 'bg-violet-100 border-violet-300', textColor: 'text-violet-800' },
    { name: 'Entrance', emoji: '🚪', color: 'bg-neutral-100 border-neutral-300', textColor: 'text-neutral-800' }
  ];

  // All available sections for the store
  const allStoreSections = [
    ...sectionTemplates,
    { name: 'Seafood', emoji: '🐟', color: 'bg-teal-100 border-teal-300', textColor: 'text-teal-800' },
    { name: 'Wine & Spirits', emoji: '🍷', color: 'bg-red-200 border-red-400', textColor: 'text-red-900' },
    { name: 'Coffee Bar', emoji: '☕', color: 'bg-amber-200 border-amber-400', textColor: 'text-amber-900' },
    { name: 'Restrooms', emoji: '🚻', color: 'bg-gray-200 border-gray-400', textColor: 'text-gray-900' },
    { name: 'ATM', emoji: '🏧', color: 'bg-green-200 border-green-400', textColor: 'text-green-900' },
    { name: 'Shopping Carts', emoji: '🛒', color: 'bg-blue-200 border-blue-400', textColor: 'text-blue-900' }
  ];

  // Get resize handles for a section
  const getResizeHandles = (section: StoreSection): ResizeHandle[] => [
    { id: 'nw', cursor: 'cursor-nw-resize', position: { x: section.x - 4, y: section.y - 4 } },
    { id: 'ne', cursor: 'cursor-ne-resize', position: { x: section.x + section.width - 4, y: section.y - 4 } },
    { id: 'sw', cursor: 'cursor-sw-resize', position: { x: section.x - 4, y: section.y + section.height - 4 } },
    { id: 'se', cursor: 'cursor-se-resize', position: { x: section.x + section.width - 4, y: section.y + section.height - 4 } },
    { id: 'n', cursor: 'cursor-n-resize', position: { x: section.x + section.width / 2 - 4, y: section.y - 4 } },
    { id: 's', cursor: 'cursor-s-resize', position: { x: section.x + section.width / 2 - 4, y: section.y + section.height - 4 } },
    { id: 'w', cursor: 'cursor-w-resize', position: { x: section.x - 4, y: section.y + section.height / 2 - 4 } },
    { id: 'e', cursor: 'cursor-e-resize', position: { x: section.x + section.width - 4, y: section.y + section.height / 2 - 4 } }
  ];

  // Handle mouse down on section
  const handleSectionMouseDown = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const mapRect = mapRef.current?.getBoundingClientRect();
    if (!mapRect) return;

    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    setSelectedSection(sectionId);
    setDragState({
      isDragging: true,
      draggedSection: sectionId,
      dragOffset: {
        x: e.clientX - mapRect.left - section.x,
        y: e.clientY - mapRect.top - section.y
      },
      isResizing: false,
      resizeHandle: null,
      isCreatingNew: false,
      newSectionTemplate: null
    });
  }, [sections]);

  // Handle mouse down on resize handle
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, sectionId: string, handleId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedSection(sectionId);
    setDragState({
      isDragging: false,
      draggedSection: sectionId,
      dragOffset: { x: 0, y: 0 },
      isResizing: true,
      resizeHandle: handleId,
      isCreatingNew: false,
      newSectionTemplate: null
    });
  }, []);

  // Handle drag start from template palette
  const handleTemplateMouseDown = useCallback((e: React.MouseEvent, template: Partial<StoreSection>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragState({
      isDragging: true,
      draggedSection: null,
      dragOffset: { x: 50, y: 25 }, // Center the section on cursor
      isResizing: false,
      resizeHandle: null,
      isCreatingNew: true,
      newSectionTemplate: template
    });
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const newZoom = Math.max(0.25, Math.min(3, zoom + delta));
    
    if (centerX !== undefined && centerY !== undefined) {
      // Zoom towards specific point
      const zoomRatio = newZoom / zoom;
      setPanOffset(prev => ({
        x: centerX - (centerX - prev.x) * zoomRatio,
        y: centerY - (centerY - prev.y) * zoomRatio
      }));
    }
    
    setZoom(newZoom);
  }, [zoom]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;
        handleZoom(e.deltaY > 0 ? -0.1 : 0.1, centerX, centerY);
      }
    }
  }, [handleZoom]);

  // Handle map panning
  const handleMapMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Click
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [panOffset]);

  const handleMapPan = useCallback((e: MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Undo/Redo functionality
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const performUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSections(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedSection(null);
    }
  }, [canUndo, historyIndex, history]);

  const performRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSections(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedSection(null);
    }
  }, [canRedo, historyIndex, history]);

  // Update sections with history tracking
  const updateSectionsWithHistory = useCallback((newSections: StoreSection[]) => {
    setSections(newSections);
    addToHistory(newSections, history, historyIndex, setHistory, setHistoryIndex);
  }, [history, historyIndex]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Handle panning
    if (isPanning) {
      handleMapPan(e);
      return;
    }

    const mapRect = mapRef.current?.getBoundingClientRect();
    if (mapRect) {
      const mouseX = (e.clientX - mapRect.left - panOffset.x) / zoom;
      const mouseY = (e.clientY - mapRect.top - panOffset.y) / zoom;
      setMousePosition({ x: mouseX, y: mouseY });
    }

    if (!dragState.isDragging && !dragState.isResizing) return;

    if (!mapRect) return;

    const mouseX = (e.clientX - mapRect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - mapRect.top - panOffset.y) / zoom;

    if (dragState.isCreatingNew && dragState.newSectionTemplate) {
      // Handle creating new section from template - just track mouse for preview
      return;
    }

    if (!dragState.draggedSection) return;

    setSections(prevSections => prevSections.map(section => {
      if (section.id !== dragState.draggedSection) return section;

      if (dragState.isDragging) {
        // Dragging - move the section
        const newX = Math.max(0, Math.min(mouseX - dragState.dragOffset.x, 1200 - section.width));
        const newY = Math.max(0, Math.min(mouseY - dragState.dragOffset.y, 600 - section.height));
        
        return { ...section, x: newX, y: newY };
      } else if (dragState.isResizing && dragState.resizeHandle) {
        // Resizing - modify dimensions based on handle
        const handle = dragState.resizeHandle;
        let newX = section.x;
        let newY = section.y;
        let newWidth = section.width;
        let newHeight = section.height;

        switch (handle) {
          case 'nw':
            newWidth = Math.max(50, section.x + section.width - mouseX);
            newHeight = Math.max(50, section.y + section.height - mouseY);
            newX = section.x + section.width - newWidth;
            newY = section.y + section.height - newHeight;
            break;
          case 'ne':
            newWidth = Math.max(50, mouseX - section.x);
            newHeight = Math.max(50, section.y + section.height - mouseY);
            newY = section.y + section.height - newHeight;
            break;
          case 'sw':
            newWidth = Math.max(50, section.x + section.width - mouseX);
            newHeight = Math.max(50, mouseY - section.y);
            newX = section.x + section.width - newWidth;
            break;
          case 'se':
            newWidth = Math.max(50, mouseX - section.x);
            newHeight = Math.max(50, mouseY - section.y);
            break;
          case 'n':
            newHeight = Math.max(50, section.y + section.height - mouseY);
            newY = section.y + section.height - newHeight;
            break;
          case 's':
            newHeight = Math.max(50, mouseY - section.y);
            break;
          case 'w':
            newWidth = Math.max(50, section.x + section.width - mouseX);
            newX = section.x + section.width - newWidth;
            break;
          case 'e':
            newWidth = Math.max(50, mouseX - section.x);
            break;
        }

        // Ensure section stays within bounds
        newX = Math.max(0, Math.min(newX, 1200 - newWidth));
        newY = Math.max(0, Math.min(newY, 600 - newHeight));

        return { ...section, x: newX, y: newY, width: newWidth, height: newHeight };
      }

      return section;
    }));
  }, [dragState, isPanning, handleMapPan, panOffset, zoom]);

  // Handle mouse up
  const handleMouseUp = useCallback((e?: MouseEvent) => {
    if (isPanning) {
      handlePanEnd();
      return;
    }

    if (dragState.isCreatingNew && dragState.newSectionTemplate && e) {
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (mapRect) {
        const mouseX = (e.clientX - mapRect.left - panOffset.x) / zoom;
        const mouseY = (e.clientY - mapRect.top - panOffset.y) / zoom;

        // Check if mouse is over the map canvas
        if (mouseX >= 0 && mouseX <= 1200 && mouseY >= 0 && mouseY <= 600) {
          const newX = Math.max(0, Math.min(mouseX - dragState.dragOffset.x, 1200 - 200));
          const newY = Math.max(0, Math.min(mouseY - dragState.dragOffset.y, 600 - 150));

          const newSection: StoreSection = {
            id: `section-${Date.now()}`,
            name: dragState.newSectionTemplate.name || 'New Section',
            emoji: dragState.newSectionTemplate.emoji || '📦',
            color: dragState.newSectionTemplate.color || 'bg-gray-100 border-gray-300',
            textColor: dragState.newSectionTemplate.textColor || 'text-gray-800',
            x: newX,
            y: newY,
            width: 200,
            height: 150,
            visible: true
          };

          const newSections = [...sections, newSection];
          updateSectionsWithHistory(newSections);
          setSelectedSection(newSection.id);
        }
      }
    }

    setDragState({
      isDragging: false,
      draggedSection: null,
      dragOffset: { x: 0, y: 0 },
      isResizing: false,
      resizeHandle: null,
      isCreatingNew: false,
      newSectionTemplate: null
    });

    // Mark that a drag operation just completed (if it was dragging or resizing)
    if (dragState.isDragging || dragState.isResizing) {
      setDragJustCompleted(true);
    }
  }, [dragState, isPanning, handlePanEnd, panOffset, zoom]);

  // Save sections to localStorage whenever sections change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveToLocalStorage(sections);
    }
  }, [sections]);

  // Save history to localStorage whenever history changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveHistoryToLocalStorage(history, historyIndex);
    }
  }, [history, historyIndex]);

  // Track drag completion for history
  useEffect(() => {
    if (dragJustCompleted) {
      addToHistory(sections, history, historyIndex, setHistory, setHistoryIndex);
      setDragJustCompleted(false);
    }
  }, [dragJustCompleted, sections, history, historyIndex]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
          // Ctrl+Shift+Z - Redo
          e.preventDefault();
          performRedo();
        } else if (e.key === 'y' || e.key === 'Y') {
          // Ctrl+Y - Redo
          e.preventDefault();
          performRedo();
        } else if (e.key === 'z' || e.key === 'Z') {
          // Ctrl+Z - Undo
          e.preventDefault();
          performUndo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [performUndo, performRedo]);

  // Set up mouse event listeners
  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  // Track mouse position over the map for drag preview
  useEffect(() => {
    const handleMapMouseMove = (e: MouseEvent) => {
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (mapRect) {
        const mouseX = e.clientX - mapRect.left;
        const mouseY = e.clientY - mapRect.top;
        setMousePosition({ x: mouseX, y: mouseY });
      }
    };

    if (dragState.isCreatingNew) {
      document.addEventListener('mousemove', handleMapMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMapMouseMove);
      };
    }
  }, [dragState.isCreatingNew]);

  // Add new section
  const handleAddSection = () => {
    const newSectionData: StoreSection = {
      id: `section-${Date.now()}`,
      name: newSection.name,
      emoji: newSection.emoji,
      color: newSection.color,
      textColor: newSection.textColor,
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      visible: true
    };

    const newSections = [...sections, newSectionData];
    updateSectionsWithHistory(newSections);
    setIsAddModalOpen(false);
    setNewSection({
      name: '',
      emoji: '📦',
      color: 'bg-gray-100 border-gray-300',
      textColor: 'text-gray-800'
    });
    setSelectedSection(newSectionData.id);
  };

  // Toggle section visibility
  const toggleVisibility = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId ? { ...section, visible: !section.visible } : section
    ));
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    updateSectionsWithHistory(newSections);
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Store Map Editor
            </h1>
            <p className="text-gray-600 mt-1">Drag and drop sections to arrange your store layout</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5" />
            Add Section
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Store Map Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Layout</h2>
              <div
                ref={mapRef}
                className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-grab"
                style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                onWheel={handleWheel}
                onMouseDown={handleMapMouseDown}
              >
                {/* Map content with zoom and pan transform */}
                <div
                  className="absolute inset-0 origin-top-left"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                    cursor: isPanning ? 'grabbing' : 'default'
                  }}
                >
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9ca3af" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Store sections */}
                {sections.filter(section => section.visible).map((section) => (
                  <div key={section.id} className="absolute group">
                    {/* Main section */}
                    <div
                      className={`absolute border-2 rounded-lg shadow-lg transition-all duration-200 cursor-move select-none
                        ${section.color} ${section.textColor}
                        ${selectedSection === section.id ? 'ring-4 ring-blue-400 ring-opacity-50 shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-102'}
                        ${dragState.draggedSection === section.id ? 'z-50' : 'z-10'}
                      `}
                      style={{
                        left: section.x,
                        top: section.y,
                        width: section.width,
                        height: section.height
                      }}
                      onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
                    >
                      <div className="p-3 h-full flex flex-col items-center justify-center text-center">
                        <div className="text-2xl mb-1">{section.emoji}</div>
                        <div className="font-semibold text-sm leading-tight">{section.name}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {section.width} × {section.height}
                        </div>
                      </div>
                    </div>

                    {/* Resize handles - only show for selected section */}
                    {selectedSection === section.id && !dragState.isDragging && (
                      <>
                        {getResizeHandles(section).map((handle) => (
                          <div
                            key={handle.id}
                            className={`absolute w-2 h-2 bg-blue-500 border border-white rounded-full hover:bg-blue-600 transition-colors z-50 ${handle.cursor}`}
                            style={{
                              left: handle.position.x,
                              top: handle.position.y
                            }}
                            onMouseDown={(e) => handleResizeMouseDown(e, section.id, handle.id)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ))}

                {/* Drag preview for new section */}
                {dragState.isCreatingNew && dragState.newSectionTemplate && (
                  <div
                    className="absolute pointer-events-none z-50 opacity-75"
                    style={{
                      left: Math.max(0, Math.min(mousePosition.x - dragState.dragOffset.x, 1200 - 200)),
                      top: Math.max(0, Math.min(mousePosition.y - dragState.dragOffset.y, 600 - 150)),
                      width: 200,
                      height: 150
                    }}
                  >
                    <div className={`w-full h-full border-2 rounded-lg shadow-lg ${dragState.newSectionTemplate.color} ${dragState.newSectionTemplate.textColor}`}>
                      <div className="p-3 h-full flex flex-col items-center justify-center text-center">
                        <div className="text-2xl mb-1">{dragState.newSectionTemplate.emoji}</div>
                        <div className="font-semibold text-sm leading-tight">{dragState.newSectionTemplate.name}</div>
                        <div className="text-xs mt-1 opacity-75">200 × 150</div>
                      </div>
                    </div>
                  </div>
                )}
                </div> {/* End of zoom/pan transform container */}

                {/* Undo/Redo controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={performUndo}
                      disabled={!canUndo}
                      className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                        canUndo 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                      title="Undo (Ctrl+Z)"
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={performRedo}
                      disabled={!canRedo}
                      className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                        canRedo 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                      title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                    >
                      <ArrowUturnRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2 font-mono">
                    {historyIndex + 1}/{history.length}
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleZoom(0.1)}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      title="Zoom In"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleZoom(-0.1)}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setZoom(1);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs font-mono"
                      title="Reset Zoom"
                    >
                      1:1
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2 font-mono">
                    {Math.round(zoom * 100)}%
                  </div>
                </div>

                {/* Instructions overlay */}
                {sections.length === 0 && !dragState.isCreatingNew && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">🏪</div>
                      <h3 className="text-lg font-semibold mb-2">Empty Store</h3>
                      <p>Drag section templates from the right panel to get started!</p>
                    </div>
                  </div>
                )}

                {/* Drop zone hint */}
                {dragState.isCreatingNew && (
                  <div className="absolute inset-0 border-4 border-dashed border-blue-400 bg-blue-50/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-blue-600">
                      <div className="text-4xl mb-2">📍</div>
                      <p className="font-semibold">Drop here to add section</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Controls */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Selected section</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Drag templates or move existing • Drag corners to resize</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
              {/* Current Store Sections */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Store Sections ({sections.length})</h2>
                
                {sections.length > 0 ? (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          selectedSection === section.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                        } hover:bg-gray-100 transition-colors cursor-pointer`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-sm">{section.emoji}</span>
                          <span className="font-medium text-sm truncate">{section.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSections = sections.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s);
                              updateSectionsWithHistory(newSections);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title={section.visible ? 'Hide section' : 'Show section'}
                          >
                            {section.visible ? (
                              <EyeIcon className="w-3 h-3 text-gray-600" />
                            ) : (
                              <EyeSlashIcon className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete section"
                          >
                            <TrashIcon className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="text-2xl mb-2">📍</div>
                    <p className="text-sm">No sections yet</p>
                    <p className="text-xs">Drag templates below to start</p>
                  </div>
                )}

                {sections.length > 0 && (
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => {
                        const newSections = sections.map(s => ({ ...s, visible: true }));
                        updateSectionsWithHistory(newSections);
                      }}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => {
                        const newSections = sections.map(s => ({ ...s, visible: false }));
                        updateSectionsWithHistory(newSections);
                      }}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Hide All
                    </button>
                    <button
                      onClick={() => {
                        updateSectionsWithHistory([]);
                        setSelectedSection(null);
                      }}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => {
                        updateSectionsWithHistory(getDefaultSections());
                        setSelectedSection(null);
                      }}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Reset Default
                    </button>
                  </div>
                )}
              </div>

              {/* Section Templates */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Section Templates</h2>
                <p className="text-sm text-gray-600 mb-4">Drag these templates onto the map to create new sections</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {sectionTemplates.map((template, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-md ${template.color} ${template.textColor}`}
                      onMouseDown={(e) => handleTemplateMouseDown(e, template)}
                      draggable={false}
                    >
                      <div className="flex flex-col items-center text-center">
                        <span className="text-lg mb-1">{template.emoji}</span>
                        <span className="font-medium text-xs leading-tight">{template.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3 mb-4">
                  💡 <strong>Tip:</strong> Click and drag any template above onto the map to add a new section instantly!
                </div>
              </div>

              {/* Current Sections */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Current Sections</h2>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer
                        ${selectedSection === section.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        ${!section.visible ? 'opacity-50' : ''}
                      `}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{section.emoji}</span>
                          <span className="font-medium text-sm">{section.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVisibility(section.id);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {section.visible ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Position: ({Math.round(section.x)}, {Math.round(section.y)})
                        <br />
                        Size: {section.width} × {section.height}
                      </div>
                    </div>
                  ))}

                  {sections.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🏪</div>
                      <p className="text-sm">No sections yet</p>
                      <p className="text-xs">Drag templates to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedSection && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Selection Info</h3>
                  <p className="text-sm text-blue-600">
                    Click and drag to move the section. Drag the blue handles to resize.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Section</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => setNewSection(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={newSection.emoji}
                  onChange={(e) => setNewSection(prev => ({ ...prev, emoji: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                  placeholder="📦"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setNewSection(prev => ({ 
                        ...prev, 
                        color: theme.color, 
                        textColor: theme.textColor 
                      }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${theme.color} ${theme.textColor}
                        ${newSection.color === theme.color ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}
                      `}
                    >
                      <div className="text-xs font-medium">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                disabled={!newSection.name.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}