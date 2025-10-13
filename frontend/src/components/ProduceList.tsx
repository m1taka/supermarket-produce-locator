'use client';

import React from 'react';
import { ProduceListProps } from '../types';
import ProduceCard from './ProduceCard';
import { Package } from 'lucide-react';

const ProduceList: React.FC<ProduceListProps> = ({ 
    produceItems, 
    loading = false,
    error = null,
    onItemClick 
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 animate-pulse">
                        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3"></div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <Package size={48} className="mx-auto mb-2" />
                    <p className="text-lg font-medium">Error loading produce</p>
                    <p className="text-sm text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!produceItems || produceItems.length === 0) {
        return (
            <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No produce items found
                </h3>
                <p className="text-gray-500">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Enhanced List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white shadow-lg">
                        <Package size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Fresh Products
                        </h2>
                        <p className="text-gray-600 mt-1">Browse our premium selection</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-sm">
                        {produceItems.length} item{produceItems.length !== 1 ? 's' : ''} available
                    </span>
                </div>
            </div>
            
            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {produceItems.map((item) => (
                    <div key={item._id} className="group">
                        <ProduceCard
                            item={item}
                            onClick={onItemClick}
                            showLocation={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProduceList;