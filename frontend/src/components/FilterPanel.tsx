'use client';

import React from 'react';
import { FilterPanelProps } from '../types';
import { X } from 'lucide-react';

const FilterPanel: React.FC<FilterPanelProps> = ({
    categories,
    aisles,
    filters,
    onFiltersChange
}) => {
    const handleCategoryChange = (category: string) => {
        onFiltersChange({
            ...filters,
            category: filters.category === category ? undefined : category
        });
    };

    const handleAisleChange = (aisle: string) => {
        onFiltersChange({
            ...filters,
            aisle: filters.aisle === aisle ? undefined : aisle
        });
    };

    const handleToggleFilter = (filterKey: keyof typeof filters) => {
        onFiltersChange({
            ...filters,
            [filterKey]: !filters[filterKey]
        });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                    <X size={16} />
                    <span>Clear All</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {categories.map((category) => (
                            <label
                                key={category}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.category === category}
                                    onChange={() => handleCategoryChange(category)}
                                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">
                                    {category.replace('_', ' ')}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Aisles */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Aisle</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {aisles.map((aisle) => (
                            <label
                                key={aisle}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.aisle === aisle}
                                    onChange={() => handleAisleChange(aisle)}
                                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{aisle}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!filters.inStock}
                                onChange={() => handleToggleFilter('inStock')}
                                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">In Stock Only</span>
                        </label>
                    </div>
                </div>

                {/* Special Types */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Special</h4>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!filters.organic}
                                onChange={() => handleToggleFilter('organic')}
                                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Organic</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!filters.local}
                                onChange={() => handleToggleFilter('local')}
                                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Local</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;