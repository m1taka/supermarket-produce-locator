'use client';

import React, { useState, useCallback } from 'react';
import { SearchBarProps } from '../types';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC<SearchBarProps> = ({ 
    onSearch, 
    onFiltersChange,
    placeholder = "Search for produce items...",
    loading = false 
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        onSearch(query.trim());
    }, [query, onSearch]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        
        // Trigger search on input change with debounce effect
        const timeoutId = setTimeout(() => {
            onSearch(newQuery.trim());
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [onSearch]);

    const clearSearch = useCallback(() => {
        setQuery('');
        onSearch('');
    }, [onSearch]);

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search 
                        className={`h-6 w-6 transition-all duration-300 ${
                            loading ? 'animate-pulse text-blue-500' : 
                            query ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                    />
                </div>
                
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={loading}
                    className="block w-full pl-12 pr-14 py-4 text-lg font-medium
                             bg-white/60 backdrop-blur-md border-2 border-white/30 rounded-2xl 
                             placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                             focus:border-blue-400 focus:bg-white/80 hover:bg-white/70
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             disabled:bg-gray-100/60 disabled:cursor-not-allowed text-gray-900"
                />
                
                {query && !loading && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10
                                 text-gray-400 hover:text-red-500 transition-all duration-300
                                 hover:scale-110 active:scale-95"
                    >
                        <div className="p-1 rounded-full hover:bg-red-50 transition-colors">
                            <X className="h-5 w-5" />
                        </div>
                    </button>
                )}
                
                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-10">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-6 w-6 border-3 border-gray-200 border-t-blue-500" />
                            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-blue-300 animate-ping" />
                        </div>
                    </div>
                )}
                
                {/* Animated border gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 opacity-0 
                               transition-opacity duration-300 -z-10 blur-sm ${
                    query ? 'opacity-20' : 'group-hover:opacity-10'
                }`} />
            </div>
            
            {/* Search suggestions (if needed in future) */}
            {query && (
                <div className="absolute top-full mt-2 left-0 right-0 z-50">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-2">
                        <div className="text-sm text-gray-600 p-3">
                            Press Enter to search for "{query}"
                        </div>
                    </div>
                </div>
            )}
            
            {/* Hidden submit button for form functionality */}
            <button type="submit" className="sr-only" />
        </form>
    );
};

export default SearchBar;