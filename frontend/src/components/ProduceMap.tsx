'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ProduceMapProps, Produce } from '../types';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Navigation, ShoppingCart, Layers } from 'lucide-react';

const ProduceMap: React.FC<ProduceMapProps> = ({ 
    produceItems, 
    selectedItem,
    onLocationClick 
}) => {
    const [zoom, setZoom] = useState(0.8);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showLabels, setShowLabels] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<Produce | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // Enhanced Store layout configuration with realistic supermarket design
    const storeLayout = {
        width: 1200,
        height: 800,
        entrance: { x: 580, y: 750, width: 40, height: 30 },
        checkout: { x: 400, y: 680, width: 400, height: 60 },
        departments: [
            // Produce Section
            { id: 'PRODUCE', x: 50, y: 50, width: 300, height: 200, label: '🥬 Fresh Produce', color: 'bg-green-100 border-green-300', textColor: 'text-green-800' },
            
            // Bakery Section  
            { id: 'BAKERY', x: 370, y: 50, width: 200, height: 120, label: '🍞 Bakery', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800' },
            
            // Deli Section
            { id: 'DELI', x: 590, y: 50, width: 200, height: 120, label: '🥪 Deli', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800' },
            
            // Meat & Seafood
            { id: 'MEAT', x: 810, y: 50, width: 200, height: 200, label: '🥩 Meat & Seafood', color: 'bg-red-100 border-red-300', textColor: 'text-red-800' },
            
            // Dairy & Eggs
            { id: 'DAIRY', x: 1030, y: 50, width: 120, height: 300, label: '🥛 Dairy & Eggs', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800' },
            
            // Frozen Foods
            { id: 'FROZEN', x: 1030, y: 370, width: 120, height: 200, label: '🧊 Frozen Foods', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800' },
            
            // Beverages
            { id: 'BEVERAGES', x: 810, y: 270, width: 200, height: 150, label: '🥤 Beverages', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800' },
            
            // Snacks & Candy
            { id: 'SNACKS', x: 810, y: 440, width: 200, height: 130, label: '🍿 Snacks & Candy', color: 'bg-pink-100 border-pink-300', textColor: 'text-pink-800' },
        ],
        aisles: [
            // Produce Aisles
            { id: 'A1', x: 80, y: 80, width: 120, height: 60, label: 'Fruits', section: 'fruits', icon: '🍎' },
            { id: 'A2', x: 210, y: 80, width: 120, height: 60, label: 'Vegetables', section: 'vegetables', icon: '🥕' },
            { id: 'A3', x: 80, y: 150, width: 120, height: 60, label: 'Herbs', section: 'herbs', icon: '🌿' },
            { id: 'A4', x: 210, y: 150, width: 120, height: 60, label: 'Organic', section: 'organic', icon: '🌱' },
            
            // Main Store Aisles
            { id: 'B1', x: 100, y: 300, width: 80, height: 200, label: 'Aisle 1', section: 'pantry', icon: '🥫' },
            { id: 'B2', x: 200, y: 300, width: 80, height: 200, label: 'Aisle 2', section: 'cereal', icon: '🥣' },
            { id: 'B3', x: 300, y: 300, width: 80, height: 200, label: 'Aisle 3', section: 'pasta', icon: '🍝' },
            { id: 'B4', x: 400, y: 300, width: 80, height: 200, label: 'Aisle 4', section: 'international', icon: '🌍' },
            { id: 'B5', x: 500, y: 300, width: 80, height: 200, label: 'Aisle 5', section: 'baking', icon: '🧁' },
            { id: 'B6', x: 600, y: 300, width: 80, height: 200, label: 'Aisle 6', section: 'health', icon: '💊' },
            { id: 'B7', x: 700, y: 300, width: 80, height: 200, label: 'Aisle 7', section: 'household', icon: '🧽' },
        ]
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ 
            x: e.clientX - pan.x, 
            y: e.clientY - pan.y 
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoom = (direction: 'in' | 'out') => {
        const factor = direction === 'in' ? 1.2 : 0.8;
        setZoom(prev => Math.max(0.5, Math.min(3, prev * factor)));
    };

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const getItemPosition = (item: Produce) => {
        // Find the aisle for this item based on category
        let targetAisle;
        
        // Smart positioning based on item category
        if (item.category === 'fruits') {
            targetAisle = storeLayout.aisles.find(a => a.section === 'fruits');
        } else if (item.category === 'vegetables') {
            targetAisle = storeLayout.aisles.find(a => a.section === 'vegetables');
        } else if (item.category === 'herbs') {
            targetAisle = storeLayout.aisles.find(a => a.section === 'herbs');
        } else if (item.isOrganic) {
            targetAisle = storeLayout.aisles.find(a => a.section === 'organic');
        } else {
            // Try to find by aisle ID
            targetAisle = storeLayout.aisles.find(a => a.id === item.location.aisle);
        }
        
        if (!targetAisle) {
            // Default to produce section
            targetAisle = storeLayout.aisles[0];
        }
        
        // Create distributed positioning within the aisle
        const itemIndex = item.name.charCodeAt(0) + item.name.charCodeAt(1);
        const offsetX = (itemIndex % 3) * (targetAisle.width / 4);
        const offsetY = ((itemIndex / 3) % 3) * (targetAisle.height / 4);
        
        return {
            x: targetAisle.x + offsetX + 10,
            y: targetAisle.y + offsetY + 10
        };
    };

    const getCategoryColor = (item: Produce) => {
        if (item.category === 'fruits') return 'from-red-500 to-orange-500';
        if (item.category === 'vegetables') return 'from-green-500 to-emerald-500';
        if (item.category === 'herbs') return 'from-green-600 to-teal-500';
        if (item.isOrganic) return 'from-purple-500 to-indigo-500';
        return 'from-blue-500 to-cyan-500';
    };

    const getCategoryIcon = (item: Produce) => {
        if (item.category === 'fruits') return '🍎';
        if (item.category === 'vegetables') return '🥕';
        if (item.category === 'herbs') return '🌿';
        if (item.isOrganic) return '🌱';
        return '📦';
    };

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-6">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Navigation size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Interactive Store Map</h2>
                            <p className="text-white/80">Navigate through our supermarket layout</p>
                        </div>
                    </div>
                    
                    {/* Enhanced Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowLabels(!showLabels)}
                            className={`p-3 rounded-xl transition-all duration-300 ${
                                showLabels 
                                    ? 'bg-white/30 text-white' 
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                            title="Toggle Labels"
                        >
                            <Layers size={20} />
                        </button>
                        
                        <button
                            onClick={() => handleZoom('out')}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                            title="Zoom Out"
                        >
                            <ZoomOut size={20} />
                        </button>
                        
                        <button
                            onClick={() => handleZoom('in')}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                            title="Zoom In"
                        >
                            <ZoomIn size={20} />
                        </button>
                        
                        <button
                            onClick={resetView}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                            title="Reset View"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Map Container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-[600px]">
                <div
                    ref={mapRef}
                    className="relative w-full h-full cursor-move select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                >
                    {/* Store Floor */}
                    <div
                        className="absolute bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl border-4 border-gray-300"
                        style={{
                            width: storeLayout.width,
                            height: storeLayout.height,
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Store Departments */}
                        {storeLayout.departments.map((dept) => (
                            <div
                                key={dept.id}
                                className={`absolute border-2 ${dept.color} ${dept.textColor} rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer`}
                                style={{
                                    left: dept.x,
                                    top: dept.y,
                                    width: dept.width,
                                    height: dept.height
                                }}
                                onClick={() => onLocationClick && onLocationClick({ 
                                    aisle: dept.id, 
                                    section: dept.label, 
                                    shelf: 'A1' 
                                })}
                            >
                                <div className="p-4 h-full flex flex-col justify-center items-center text-center">
                                    <div className="text-2xl mb-2">{dept.label.split(' ')[0]}</div>
                                    {showLabels && (
                                        <div className="font-bold text-sm">{dept.label.substring(2)}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Store Aisles */}
                        {storeLayout.aisles.map((aisle) => (
                            <div
                                key={aisle.id}
                                className="absolute bg-white border-2 border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                style={{
                                    left: aisle.x,
                                    top: aisle.y,
                                    width: aisle.width,
                                    height: aisle.height
                                }}
                                onClick={() => onLocationClick && onLocationClick({ 
                                    aisle: aisle.id, 
                                    section: aisle.label, 
                                    shelf: 'A1' 
                                })}
                            >
                                <div className="p-2 h-full flex flex-col justify-center items-center text-center group-hover:bg-blue-50 rounded-xl transition-colors">
                                    <div className="text-2xl mb-1">{aisle.icon}</div>
                                    <div className="font-bold text-xs text-gray-800">{aisle.id}</div>
                                    {showLabels && (
                                        <div className="text-xs text-gray-600">{aisle.label}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Store Entrance */}
                        <div
                            className="absolute bg-gradient-to-t from-green-400 to-green-500 border-2 border-green-600 rounded-t-2xl shadow-lg flex items-center justify-center"
                            style={{
                                left: storeLayout.entrance.x,
                                top: storeLayout.entrance.y,
                                width: storeLayout.entrance.width,
                                height: storeLayout.entrance.height
                            }}
                        >
                            <div className="text-white font-bold text-xs">🚪 ENTRANCE</div>
                        </div>

                        {/* Checkout Area */}
                        <div
                            className="absolute bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-blue-600 rounded-2xl shadow-lg flex items-center justify-center"
                            style={{
                                left: storeLayout.checkout.x,
                                top: storeLayout.checkout.y,
                                width: storeLayout.checkout.width,
                                height: storeLayout.checkout.height
                            }}
                        >
                            <div className="text-white font-bold flex items-center space-x-2">
                                <ShoppingCart size={20} />
                                <span>CHECKOUT COUNTERS</span>
                            </div>
                        </div>

                        {/* Enhanced Produce Items */}
                        {produceItems.map((item) => {
                            const position = getItemPosition(item);
                            const isSelected = selectedItem?._id === item._id;
                            const isHovered = hoveredItem?._id === item._id;
                            
                            return (
                                <div
                                    key={item._id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                                        isSelected 
                                            ? 'z-30 scale-150' 
                                            : isHovered
                                            ? 'z-20 scale-125'
                                            : 'hover:scale-110 hover:z-20'
                                    }`}
                                    style={{
                                        left: position.x,
                                        top: position.y
                                    }}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    title={`${item.name} - ${item.location.aisle}, ${item.location.section}`}
                                >
                                    {/* Enhanced Item Marker */}
                                    <div className={`relative p-3 rounded-2xl shadow-2xl border-2 transition-all duration-300 ${
                                        isSelected 
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 animate-pulse' 
                                            : item.stock > 0
                                            ? `bg-gradient-to-r ${getCategoryColor(item)} border-white shadow-lg`
                                            : 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-300'
                                    }`}>
                                        <div className="text-white font-bold text-lg">
                                            {getCategoryIcon(item)}
                                        </div>
                                        
                                        {/* Stock indicator */}
                                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            item.stock > 20 ? 'bg-green-500' : item.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                        
                                        {/* Enhanced Item info tooltip */}
                                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 transition-all duration-300 ${
                                            isHovered || isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                                        } z-40`}>
                                            <div className="bg-white/95 backdrop-blur-md text-gray-800 text-sm rounded-xl p-4 shadow-2xl border border-white/30 min-w-[200px]">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-2xl">{getCategoryIcon(item)}</span>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{item.name}</div>
                                                        <div className="text-xs text-gray-600">{item.brand || 'Store Brand'}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Location:</span>
                                                        <span className="font-medium">{item.location.aisle}, {item.location.section}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Price:</span>
                                                        <span className="font-bold text-green-600">${item.price.toFixed(2)}/{item.unit}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Stock:</span>
                                                        <span className={`font-medium ${item.stock > 10 ? 'text-green-600' : item.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                            {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                    {item.isOrganic && (
                                                        <div className="flex items-center space-x-1 text-green-600">
                                                            <span>🌱</span>
                                                            <span className="font-medium">Organic</span>
                                                        </div>
                                                    )}
                                                    {item.isLocal && (
                                                        <div className="flex items-center space-x-1 text-blue-600">
                                                            <span>🏠</span>
                                                            <span className="font-medium">Local</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Tooltip arrow */}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white/95"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Enhanced Legend */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-gray-700">🍎 Fruits</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-gray-700">🥕 Vegetables</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-green-600 to-teal-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-gray-700">🌿 Herbs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-gray-700">🌱 Organic</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">High Stock</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-600">Low Stock</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">Out of Stock</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 text-center text-gray-500 text-sm">
                    💡 <strong>Tip:</strong> Drag to pan • Zoom buttons to navigate • Hover items for details • Click aisles to filter
                </div>
            </div>

            {/* Enhanced Selected Item Info */}
            {selectedItem && (
                <div className="m-6 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl border-2 border-blue-200 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-white rounded-2xl shadow-md">
                                <span className="text-4xl">{getCategoryIcon(selectedItem)}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {selectedItem.name}
                                </h3>
                                <p className="text-gray-600 mb-3">{selectedItem.brand || 'Store Brand'}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    {selectedItem.isOrganic && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                            🌱 Organic
                                        </span>
                                    )}
                                    {selectedItem.isLocal && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                            🏠 Local
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                ${selectedItem.price.toFixed(2)}
                            </div>
                            <div className="text-gray-500">per {selectedItem.unit}</div>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="text-sm text-gray-600 mb-1">📍 Location</div>
                            <div className="font-bold text-gray-900">
                                {selectedItem.location.aisle}, {selectedItem.location.section}
                            </div>
                            <div className="text-sm text-gray-600">Shelf {selectedItem.location.shelf}</div>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="text-sm text-gray-600 mb-1">📦 Stock Level</div>
                            <div className={`font-bold text-lg ${
                                selectedItem.stock > 20 ? 'text-green-600' : 
                                selectedItem.stock > 5 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                                {selectedItem.stock > 0 ? `${selectedItem.stock} available` : 'Out of stock'}
                            </div>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="text-sm text-gray-600 mb-1">🏷️ Category</div>
                            <div className="font-bold text-gray-900 capitalize">
                                {selectedItem.category.replace('_', ' ')}
                            </div>
                            {selectedItem.subcategory && (
                                <div className="text-sm text-gray-600 capitalize">{selectedItem.subcategory}</div>
                            )}
                        </div>
                    </div>
                    
                    {selectedItem.description && (
                        <div className="mt-4 p-4 bg-white/40 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">📝 Description</div>
                            <div className="text-gray-800">{selectedItem.description}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProduceMap;