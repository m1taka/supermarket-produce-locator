'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Produce, SearchFilters, PaginatedResponse } from '../types';
import SearchBar from '../components/SearchBar';
import ProduceList from '../components/ProduceList';
import ProduceMap from '../components/ProduceMap';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, List, Filter } from 'lucide-react';
import { sampleProduceData } from '../data/sampleData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
    const [produceItems, setProduceItems] = useState<Produce[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [selectedItem, setSelectedItem] = useState<Produce | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [aisles, setAisles] = useState<string[]>([]);

    // Fetch initial data
    useEffect(() => {
        fetchProduceItems();
        fetchCategories();
    }, []);

    // Fetch produce items with current filters
    useEffect(() => {
        fetchProduceItems();
    }, [searchQuery, filters]);

    const fetchProduceItems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to fetch from API first
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (filters.category) params.append('category', filters.category);
                if (filters.aisle) params.append('aisle', filters.aisle);
                if (filters.inStock) params.append('inStock', 'true');
                if (filters.organic) params.append('organic', 'true');
                if (filters.local) params.append('local', 'true');

                const response = await fetch(`${API_BASE_URL}/produce?${params}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    const data: PaginatedResponse<Produce> = await response.json();
                    setProduceItems(data.items);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using sample data');
            }

            // Fallback to sample data with client-side filtering
            let filteredItems = [...sampleProduceData];

            // Apply search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filteredItems = filteredItems.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    item.brand?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query)
                );
            }

            // Apply category filter
            if (filters.category) {
                filteredItems = filteredItems.filter(item => item.category === filters.category);
            }

            // Apply aisle filter
            if (filters.aisle) {
                filteredItems = filteredItems.filter(item => item.location.aisle === filters.aisle);
            }

            // Apply stock filter
            if (filters.inStock) {
                filteredItems = filteredItems.filter(item => item.stock > 0);
            }

            // Apply organic filter
            if (filters.organic) {
                filteredItems = filteredItems.filter(item => item.isOrganic);
            }

            // Apply local filter
            if (filters.local) {
                filteredItems = filteredItems.filter(item => item.isLocal);
            }

            setProduceItems(filteredItems);
        } catch (err) {
            console.error('Error fetching produce items:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch produce items');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Try API first
            try {
                const response = await fetch(`${API_BASE_URL}/produce/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                    setAisles(data.aisles || []);
                    return;
                }
            } catch (apiError) {
                console.log('Categories API not available, using sample data');
            }

            // Fallback to sample data
            const uniqueCategories = [...new Set(sampleProduceData.map(item => item.category))];
            const uniqueAisles = [...new Set(sampleProduceData.map(item => item.location.aisle))];
            
            setCategories(uniqueCategories.sort());
            setAisles(uniqueAisles.sort());
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    const handleItemClick = (item: Produce) => {
        setSelectedItem(item);
        setViewMode('map');
    };

    const handleRetry = () => {
        fetchProduceItems();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            {/* Modern Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                🛒 SuperMarket Navigator
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Find any product instantly with our interactive store map
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link 
                                href="/supermarkets"
                                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Browse Stores</span>
                            </Link>
                            <div className="hidden sm:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Live Store Map</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Enhanced Search and Controls */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar with Glass Effect */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                        <SearchBar
                            onSearch={handleSearch}
                            onFiltersChange={handleFiltersChange}
                            placeholder="🔍 Search for apples, bread, or any product..."
                            loading={loading}
                        />
                    </div>
                    
                    {/* Enhanced Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                                showFilters 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/30'
                            }`}
                        >
                            <Filter size={20} />
                            <span className="font-medium">Smart Filters</span>
                            {showFilters && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-white/30">
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                    viewMode === 'map' 
                                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                                        : 'text-gray-600 hover:bg-white/50'
                                }`}
                            >
                                <MapPin size={18} />
                                <span className="font-medium">Store Map</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                    viewMode === 'list' 
                                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                                        : 'text-gray-600 hover:bg-white/50'
                                }`}
                            >
                                <List size={18} />
                                <span className="font-medium">List View</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters Panel */}
                {showFilters && (
                    <div className="mb-8 animate-slide-down">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                            <FilterPanel
                                categories={categories}
                                aisles={aisles}
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                            />
                        </div>
                    </div>
                )}

            {/* Content */}
            <div className="min-h-96">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} onRetry={handleRetry} />
                ) : (
                    <>
                        {viewMode === 'list' ? (
                            <ProduceList
                                produceItems={produceItems}
                                loading={loading}
                                error={error || undefined}
                                onItemClick={handleItemClick}
                            />
                        ) : (
                            <ProduceMap
                                produceItems={produceItems}
                                selectedItem={selectedItem}
                            />
                        )}
                    </>
                )}
            </div>

                {/* Results Summary */}
                {!loading && !error && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg">
                            <span className="text-gray-700 font-medium">
                                Found {produceItems.length} item{produceItems.length !== 1 ? 's' : ''}
                            </span>
                            {searchQuery && (
                                <span className="text-blue-600 font-semibold"> for "{searchQuery}"</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}