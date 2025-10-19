'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Phone, Star, Search, Filter } from 'lucide-react';

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

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  aisle: string;
  section: string;
  description: string;
}

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
  description: string;
  sections: StoreSection[];
  products: Product[];
}

export default function SupermarketMapPage() {
  const params = useParams();
  const storeId = params.id as string;
  
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockSupermarket: Supermarket = {
      id: storeId,
      name: 'Fresh Mart Downtown',
      address: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 123-4567',
      hours: '7:00 AM - 11:00 PM',
      rating: 4.5,
      totalReviews: 248,
      description: 'Your neighborhood fresh market with organic produce, artisanal breads, and locally sourced products.',
      sections: [
        { id: 'produce', name: 'Fresh Produce', emoji: '🥬', color: 'bg-green-100 border-green-300', textColor: 'text-green-800', x: 50, y: 50, width: 300, height: 200, visible: true },
        { id: 'bakery', name: 'Bakery', emoji: '🍞', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', x: 370, y: 50, width: 200, height: 120, visible: true },
        { id: 'deli', name: 'Deli', emoji: '🥪', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', x: 590, y: 50, width: 200, height: 120, visible: true },
        { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', color: 'bg-red-100 border-red-300', textColor: 'text-red-800', x: 810, y: 50, width: 200, height: 200, visible: true },
        { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', x: 1030, y: 50, width: 120, height: 300, visible: true },
        { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800', x: 1030, y: 370, width: 120, height: 200, visible: true }
      ],
      products: [
        { id: 'prod-1', name: 'Organic Bananas', category: 'Produce', brand: 'Fresh Farm', price: 2.99, inStock: true, aisle: 'A1', section: 'produce', description: 'Fresh organic bananas' },
        { id: 'prod-2', name: 'Whole Wheat Bread', category: 'Bakery', brand: 'Baker\'s Choice', price: 3.49, inStock: true, aisle: 'B2', section: 'bakery', description: 'Fresh baked whole wheat bread' },
        { id: 'prod-3', name: 'Organic Milk', category: 'Dairy', brand: 'Pure Farms', price: 4.99, inStock: true, aisle: 'C3', section: 'dairy', description: 'Organic whole milk' },
        { id: 'prod-4', name: 'Premium Ribeye Steak', category: 'Meat', brand: 'Prime Cuts', price: 19.99, inStock: true, aisle: 'D4', section: 'meat', description: 'Premium cut ribeye steak' },
        { id: 'prod-5', name: 'Frozen Pizza Margherita', category: 'Frozen', brand: 'Italian Kitchen', price: 6.99, inStock: false, aisle: 'E5', section: 'frozen', description: 'Authentic Italian margherita pizza' }
      ]
    };

    // Simulate API delay
    setTimeout(() => {
      setSupermarket(mockSupermarket);
      setLoading(false);
    }, 1000);
  }, [storeId]);

  const categories = ['all', ...Array.from(new Set(supermarket?.products.map(p => p.category) || []))];

  const filteredProducts = supermarket?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleProductClick = (product: Product) => {
    setHighlightedSection(product.section);
    // Scroll to map
    document.getElementById('store-map')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <p className="text-gray-600 text-lg">Loading store map...</p>
        </div>
      </div>
    );
  }

  if (!supermarket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h2>
          <p className="text-gray-600 mb-6">The supermarket you're looking for doesn't exist.</p>
          <Link
            href="/supermarkets"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Browse All Stores
          </Link>
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
            <Link href="/supermarkets" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Stores</span>
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
        {/* Store Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{supermarket.name}</h1>
              <p className="text-gray-600 mb-4">{supermarket.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{supermarket.address}, {supermarket.city}, {supermarket.state} {supermarket.zipCode}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>{supermarket.hours}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <span>{supermarket.phone}</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-end gap-1 mb-2">
                {renderStars(supermarket.rating)}
                <span className="text-sm text-gray-600 ml-2">
                  {supermarket.rating} ({supermarket.totalReviews} reviews)
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{supermarket.rating}/5</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Store Layout</h2>
              <div
                id="store-map"
                className="relative w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
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
                {supermarket.sections.filter(section => section.visible).map((section) => (
                  <div
                    key={section.id}
                    className={`absolute border-2 rounded-lg shadow-lg transition-all duration-300 cursor-pointer select-none
                      ${section.color} ${section.textColor}
                      ${highlightedSection === section.id ? 'ring-4 ring-blue-400 ring-opacity-50 shadow-2xl scale-105 z-20' : 'hover:shadow-xl hover:scale-102 z-10'}
                    `}
                    style={{
                      left: section.x,
                      top: section.y,
                      width: section.width,
                      height: section.height,
                      transform: `scale(0.8)` // Scale down for better fit
                    }}
                    onClick={() => setHighlightedSection(highlightedSection === section.id ? null : section.id)}
                  >
                    <div className="p-3 h-full flex flex-col items-center justify-center text-center">
                      <div className="text-2xl mb-1">{section.emoji}</div>
                      <div className="font-semibold text-sm leading-tight">{section.name}</div>
                      {highlightedSection === section.id && (
                        <div className="text-xs mt-1 opacity-75">
                          Click to unselect
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 max-w-xs">
                  <p><strong>💡 Tip:</strong> Click on sections to highlight them, or search for products to see their locations!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Search & List */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Products</h2>
              
              {/* Search */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${highlightedSection === product.section 
                        ? 'border-blue-400 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                      ${!product.inStock ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {product.category}
                        </span>
                        <span className="text-gray-500">Aisle {product.aisle}</span>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No products found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Sections</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supermarket.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setHighlightedSection(highlightedSection === section.id ? null : section.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${section.color} ${section.textColor}
                  ${highlightedSection === section.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}
                `}
              >
                <span className="text-xl">{section.emoji}</span>
                <span className="font-medium text-sm">{section.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}