'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  MapPin, 
  Palette,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';

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

export default function StoreSectionsPage() {
  const [sections, setSections] = useState<StoreSection[]>([
    { id: 'produce', name: 'Fresh Produce', emoji: '🥬', color: 'bg-green-100 border-green-300', textColor: 'text-green-800', x: 50, y: 50, width: 300, height: 200, visible: true },
    { id: 'bakery', name: 'Bakery', emoji: '🍞', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', x: 370, y: 50, width: 200, height: 120, visible: true },
    { id: 'deli', name: 'Deli', emoji: '🥪', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', x: 590, y: 50, width: 200, height: 120, visible: true },
    { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', color: 'bg-red-100 border-red-300', textColor: 'text-red-800', x: 810, y: 50, width: 200, height: 200, visible: true },
    { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', x: 1030, y: 50, width: 120, height: 300, visible: true },
    { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', color: 'bg-cyan-100 border-cyan-300', textColor: 'text-cyan-800', x: 1030, y: 370, width: 120, height: 200, visible: true }
  ]);

  const [editingSection, setEditingSection] = useState<StoreSection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const colorOptions = [
    { bg: 'bg-red-100 border-red-300', text: 'text-red-800', name: 'Red' },
    { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-800', name: 'Orange' },
    { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-800', name: 'Yellow' },
    { bg: 'bg-green-100 border-green-300', text: 'text-green-800', name: 'Green' },
    { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', name: 'Blue' },
    { bg: 'bg-indigo-100 border-indigo-300', text: 'text-indigo-800', name: 'Indigo' },
    { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-800', name: 'Purple' },
    { bg: 'bg-pink-100 border-pink-300', text: 'text-pink-800', name: 'Pink' },
    { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-800', name: 'Gray' }
  ];

  const handleAddSection = () => {
    const newSection: StoreSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      emoji: '📦',
      color: 'bg-gray-100 border-gray-300',
      textColor: 'text-gray-800',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      visible: true
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
    setShowAddModal(false);
  };

  const handleEditSection = (section: StoreSection) => {
    setEditingSection({ ...section });
  };

  const handleSaveSection = () => {
    if (!editingSection) return;
    
    setSections(sections.map(section => 
      section.id === editingSection.id ? editingSection : section
    ));
    setEditingSection(null);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(section => section.id !== sectionId));
      if (editingSection?.id === sectionId) {
        setEditingSection(null);
      }
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Sections</h1>
          <p className="text-gray-600 mt-2">Manage your supermarket layout and sections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Section</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="xl:col-span-1">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sections List</h2>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedSection === section.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{section.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.name}</h3>
                        <p className="text-sm text-gray-500">
                          {section.width}×{section.height}px
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(section.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          section.visible 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSection(section);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="xl:col-span-2">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Store Layout Preview</h2>
              <div className="text-sm text-gray-600">Click sections to select • Drag to move</div>
            </div>
            
            {/* Map Container */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 border-4 border-gray-300 rounded-3xl overflow-hidden" style={{ height: '600px' }}>
              {sections.filter(section => section.visible).map((section) => (
                <div
                  key={section.id}
                  className={`absolute ${section.color} ${section.textColor} rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                    selectedSection === section.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  style={{
                    left: section.x,
                    top: section.y,
                    width: section.width,
                    height: section.height,
                    transform: selectedSection === section.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="p-4 h-full flex flex-col justify-center items-center text-center">
                    <div className="text-2xl mb-2">{section.emoji}</div>
                    <div className="font-bold text-sm">{section.name}</div>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectedSection === section.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
              
              {/* Grid overlay for alignment */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 50px)'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Section</h3>
              <button
                onClick={() => setEditingSection(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <input
                  type="text"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={editingSection.emoji}
                  onChange={(e) => setEditingSection({ ...editingSection, emoji: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setEditingSection({ 
                        ...editingSection, 
                        color: color.bg, 
                        textColor: color.text 
                      })}
                      className={`p-3 rounded-xl border-2 transition-all ${color.bg} ${color.text} ${
                        editingSection.color === color.bg ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="w-full h-8 rounded-lg"></div>
                      <div className="text-xs mt-1 font-medium">{color.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                  <input
                    type="number"
                    value={editingSection.width}
                    onChange={(e) => setEditingSection({ ...editingSection, width: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="number"
                    value={editingSection.height}
                    onChange={(e) => setEditingSection({ ...editingSection, height: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X Position</label>
                  <input
                    type="number"
                    value={editingSection.x}
                    onChange={(e) => setEditingSection({ ...editingSection, x: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
                  <input
                    type="number"
                    value={editingSection.y}
                    onChange={(e) => setEditingSection({ ...editingSection, y: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveSection}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setEditingSection(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Create New Section</h4>
              <p className="text-gray-600 mb-6">Add a new section to your store layout</p>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddSection}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Create Section
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}