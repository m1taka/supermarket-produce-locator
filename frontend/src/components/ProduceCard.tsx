'use client';

import React from 'react';
import { ProduceCardProps } from '../types';
import { MapPin, Package, Leaf, Heart, DollarSign } from 'lucide-react';

const ProduceCard: React.FC<ProduceCardProps> = ({ 
    item, 
    onClick,
    showLocation = false 
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    };

    const formatPrice = (price: number, unit: string) => {
        return `$${price.toFixed(2)}/${unit}`;
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'fruits': return 'from-red-400 via-pink-400 to-orange-400';
            case 'vegetables': return 'from-green-400 via-emerald-400 to-teal-400';
            case 'herbs': return 'from-green-500 via-teal-500 to-cyan-500';
            default: return 'from-blue-400 via-purple-400 to-indigo-400';
        }
    };

    const getCategoryEmoji = (category: string) => {
        switch (category) {
            case 'fruits': return '🍎';
            case 'vegetables': return '🥕';
            case 'herbs': return '🌿';
            default: return '📦';
        }
    };

    return (
        <div 
            className="group bg-white/70 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/30 hover:border-white/50 hover:scale-105 transform"
            onClick={handleClick}
        >
            {/* Enhanced Image placeholder */}
            <div className={`relative h-52 bg-gradient-to-br ${getCategoryGradient(item.category)} flex items-center justify-center overflow-hidden`}>
                {/* Background pattern */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                
                {/* Category emoji */}
                <div className="relative z-10 text-6xl opacity-90 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryEmoji(item.category)}
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Enhanced Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2 z-20">
                    {item.isOrganic && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm shadow-lg">
                            <Leaf size={14} className="mr-1.5" />
                            Organic
                        </span>
                    )}
                    {item.isLocal && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/90 text-white backdrop-blur-sm shadow-lg">
                            <Heart size={14} className="mr-1.5" />
                            Local
                        </span>
                    )}
                </div>

                {/* Enhanced Stock indicator */}
                <div className="absolute top-3 right-3 z-20">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg border ${
                        item.stock > 20 
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
                            : item.stock > 0 
                            ? 'bg-amber-500/90 text-white border-amber-400/50'
                            : 'bg-red-500/90 text-white border-red-400/50'
                    }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.stock > 20 ? 'bg-emerald-300' : item.stock > 0 ? 'bg-amber-300' : 'bg-red-300'
                        } animate-pulse`}></div>
                        {item.stock > 0 ? `${item.stock}` : 'Out'}
                    </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm">
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
                        {item.name}
                    </h3>
                    {item.brand && (
                        <p className="text-sm text-gray-600 font-medium">{item.brand}</p>
                    )}
                </div>

                <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-800 border border-purple-300/30 backdrop-blur-sm capitalize">
                        {item.category.replace('_', ' ')}
                    </span>
                </div>

                {item.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2 bg-white/40 rounded-lg p-3 border border-white/30 backdrop-blur-sm">
                        {item.description}
                    </p>
                )}

                {/* Enhanced Location */}
                {showLocation && (
                    <div className="flex items-center text-sm text-gray-700 mb-4 bg-white/50 rounded-full px-4 py-2 backdrop-blur-sm border border-white/30">
                        <MapPin size={16} className="mr-2 text-blue-600" />
                        <span className="font-medium">
                            Aisle {item.location.aisle}, {item.location.section}
                        </span>
                    </div>
                )}

                {/* Enhanced Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-4 py-2 shadow-lg">
                            <div className="flex items-center">
                                <DollarSign size={16} className="mr-1" />
                                <span className="text-lg font-bold">
                                    {formatPrice(item.price, item.unit)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 bg-white/50 rounded-full px-3 py-1 backdrop-blur-sm">
                        Fresh today
                    </div>
                </div>

                {/* Enhanced Nutritional info preview */}
                {item.nutritionalInfo && (
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                        <p className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Nutrition Info
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                            {item.nutritionalInfo.calories && (
                                <div className="bg-gradient-to-br from-orange-100/70 to-orange-200/70 backdrop-blur-sm rounded-xl p-2 text-center border border-orange-200/30">
                                    <div className="font-bold text-orange-900">{item.nutritionalInfo.calories}</div>
                                    <div className="text-orange-700">cal</div>
                                </div>
                            )}
                            {item.nutritionalInfo.protein && (
                                <div className="bg-gradient-to-br from-blue-100/70 to-blue-200/70 backdrop-blur-sm rounded-xl p-2 text-center border border-blue-200/30">
                                    <div className="font-bold text-blue-900">{item.nutritionalInfo.protein}g</div>
                                    <div className="text-blue-700">protein</div>
                                </div>
                            )}
                            {item.nutritionalInfo.fiber && (
                                <div className="bg-gradient-to-br from-green-100/70 to-green-200/70 backdrop-blur-sm rounded-xl p-2 text-center border border-green-200/30">
                                    <div className="font-bold text-green-900">{item.nutritionalInfo.fiber}g</div>
                                    <div className="text-green-700">fiber</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Hover effect indicator */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-xs text-gray-500 bg-white/50 rounded-full px-3 py-1 backdrop-blur-sm inline-block">
                        Click for details
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProduceCard;