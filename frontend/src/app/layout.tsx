import React from 'react';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Supermarket Produce Locator',
  description: 'Find produce locations in your local supermarket',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                      🛒 Supermarket Locator
                    </h1>
                  </div>
                  <nav className="flex space-x-8">
                    <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Home
                    </a>
                    <a href="/admin" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Admin
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      About
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="bg-white border-t">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    © 2025 Supermarket Produce Locator. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}