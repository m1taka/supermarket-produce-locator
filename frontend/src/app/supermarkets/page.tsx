'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, Star } from 'lucide-react';

interface Supermarket {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  rating: number;
  totalReviews: number;
  image: string;
  description: string;
}

export default function SupermarketsPage() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockSupermarkets: Supermarket[] = [
      {
        id: 'fresh-mart-downtown',
        name: 'Fresh Mart Downtown',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        phone: '(555) 123-4567',
        hours: '7:00 AM - 11:00 PM',
        rating: 4.5,
        totalReviews: 248,
        image: '/api/placeholder/400/250',
        description: 'Your neighborhood fresh market with organic produce, artisanal breads, and locally sourced products.'
      },
      {
        id: 'mega-grocers-westside',
        name: 'Mega Grocers Westside',
        address: '456 Ocean Boulevard',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90401',
        phone: '(555) 987-6543',
        hours: '6:00 AM - 12:00 AM',
        rating: 4.2,
        totalReviews: 412,
        image: '/api/placeholder/400/250',
        description: 'Large format supermarket with extensive selection, pharmacy, and deli counter.'
      },
      {
        id: 'green-valley-market',
        name: 'Green Valley Market',
        address: '789 Highland Avenue',
        city: 'Pasadena',
        state: 'CA',
        zipCode: '91101',
        phone: '(555) 456-7890',
        hours: '7:00 AM - 10:00 PM',
        rating: 4.7,
        totalReviews: 156,
        image: '/api/placeholder/400/250',
        description: 'Family-owned market specializing in organic and sustainable products.'
      },
      {
        id: 'city-center-superstore',
        name: 'City Center Superstore',
        address: '321 Business District Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        phone: '(555) 321-0987',
        hours: '24 Hours',
        rating: 4.0,
        totalReviews: 589,
        image: '/api/placeholder/400/250',
        description: 'Convenient 24-hour superstore in the heart of downtown with wide aisles and modern facilities.'
      },
      {
        id: 'coastal-fresh-foods',
        name: 'Coastal Fresh Foods',
        address: '654 Pier Street',
        city: 'Santa Monica',
        state: 'CA',
        zipCode: '90405',
        phone: '(555) 654-3210',
        hours: '6:30 AM - 11:30 PM',
        rating: 4.4,
        totalReviews: 203,
        image: '/api/placeholder/400/250',
        description: 'Fresh seafood, premium meats, and coastal-inspired grocery selection near the beach.'
      },
      {
        id: 'mountain-view-grocers',
        name: 'Mountain View Grocers',
        address: '987 Summit Road',
        city: 'Oakland',
        state: 'CA',
        zipCode: '94610',
        phone: '(555) 789-0123',
        hours: '7:00 AM - 10:00 PM',
        rating: 4.3,
        totalReviews: 178,
        image: '/api/placeholder/400/250',
        description: 'Community-focused supermarket with local partnerships and competitive prices.'
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setSupermarkets(mockSupermarkets);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique cities for filter
  const cities = ['all', ...Array.from(new Set(supermarkets.map(store => store.city)))];

  // Filter supermarkets based on search and city
  const filteredSupermarkets = supermarkets.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || store.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading supermarkets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Store Locator</h1>
                <p className="text-xs text-gray-500">Find your nearest supermarket</p>
              </div>
            </Link>
            
            <Link
              href="/admin"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Local Supermarket
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover store layouts, product locations, and navigate your shopping trip with interactive maps
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search supermarkets</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, address, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="md:w-48">
              <label htmlFor="city" className="sr-only">Filter by city</label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredSupermarkets.length} of {supermarkets.length} supermarkets
            {selectedCity !== 'all' && ` in ${selectedCity}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Supermarkets Grid */}
        {filteredSupermarkets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No supermarkets found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all locations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSupermarkets.map((store) => (
              <Link
                key={store.id}
                href={`/supermarkets/${store.id}`}
                className="group bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Store Image */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30">🏪</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                    {store.city}
                  </div>
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {renderStars(store.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({store.totalReviews})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {store.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{store.address}, {store.city}, {store.state} {store.zipCode}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{store.hours}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-500" />
                      <span>{store.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">View Store Map</span>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}