'use client';

import React from 'react';
import { 
  MapPin, 
  Package, 
  TrendingUp, 
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  // Sample data - in real app, this would come from API
  const stats = [
    {
      label: 'Total Products',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Store Sections',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: MapPin,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Revenue Today',
      value: '$24,850',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      label: 'Low Stock Items',
      value: '23',
      change: '+5',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivities = [
    { action: 'Product "Organic Apples" updated', user: 'Admin', time: '2 minutes ago', type: 'edit' },
    { action: 'New section "Organic Produce" added', user: 'Super Admin', time: '1 hour ago', type: 'add' },
    { action: 'Product "Fresh Bread" price changed', user: 'Admin', time: '3 hours ago', type: 'edit' },
    { action: 'Section "Dairy" layout updated', user: 'Super Admin', time: '5 hours ago', type: 'edit' },
    { action: 'Bulk import of 50 products completed', user: 'System', time: '1 day ago', type: 'add' }
  ];

  const quickActions = [
    { label: 'Add New Product', href: '/admin/products/new', icon: Plus, color: 'from-blue-500 to-purple-600' },
    { label: 'Edit Store Layout', href: '/admin/store-map', icon: Edit, color: 'from-emerald-500 to-teal-600' },
    { label: 'View Analytics', href: '/admin/analytics', icon: Eye, color: 'from-orange-500 to-red-600' },
    { label: 'Manage Sections', href: '/admin/sections', icon: MapPin, color: 'from-purple-500 to-indigo-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-blue-100 text-lg">Manage your supermarket layout, products, and analytics</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${action.color} rounded-xl text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{action.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'add' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'add' ? (
                      <Plus className="w-5 h-5" />
                    ) : (
                      <Edit className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store Overview */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Store Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Sections</h3>
            <p className="text-gray-600 text-sm mb-4">Manage departments and aisles</p>
            <a 
              href="/admin/sections"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Manage Sections →
            </a>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Catalog</h3>
            <p className="text-gray-600 text-sm mb-4">Add, edit, and organize products</p>
            <a 
              href="/admin/products"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
            >
              Manage Products →
            </a>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">View performance and insights</p>
            <a 
              href="/admin/analytics"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Analytics →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}