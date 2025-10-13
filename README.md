# 🛒 Supermarket Produce Locator

A modern, interactive web application that helps users locate various produce items within a supermarket. Built with Next.js 15, React 18, and featuring a beautiful glassmorphism design with Tailwind CSS 4.

## ✨ Features

- **🗺️ Interactive Store Map**: Realistic supermarket floor plan with department layouts
- **🔍 Smart Search**: Real-time search with filters for category, organic, and local products
- **📱 Modern UI/UX**: Glassmorphism design with backdrop blur effects and smooth animations
- **🌿 Product Information**: Detailed nutritional info, pricing, and stock levels
- **📍 Location Tracking**: Visual indicators showing exact aisle and section locations
- **⚡ Real-time Updates**: Live stock levels and product availability
- **🎯 Category-based Organization**: Smart product positioning based on supermarket departments

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

The frontend is built with Next.js and contains the following key components:

- **src/app/layout.tsx**: Defines the layout component for the application.
- **src/app/page.tsx**: Serves as the main entry point for the application.
- **src/app/produce/page.tsx**: Displays information about the locations of produce in the supermarket.
- **src/components/ProduceMap.tsx**: Displays a map of the supermarket, highlighting produce locations.
- **src/components/ProduceList.tsx**: Lists available produce items.
- **src/components/SearchBar.tsx**: Enables users to search for specific produce items.
- **src/types/index.ts**: Contains TypeScript interfaces for the application.

### Backend

The backend is built with Express.js and connects to a MongoDB database. It includes:

- **src/app.ts**: Entry point for the Express backend, setting up middleware and routes.
- **src/controllers/produceController.ts**: Handles requests related to produce.
- **src/models/Produce.ts**: Mongoose model for the Produce schema.
- **src/routes/produceRoutes.ts**: Sets up routes for produce-related API endpoints.
- **src/middleware/auth.ts**: Middleware for authentication.
- **src/config/database.ts**: Configuration for connecting to the MongoDB database.

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/supermarket-produce-locator.git
   cd supermarket-produce-locator
   ```

2. **Install dependencies**:
   ```bash
   # Frontend (Next.js + Tailwind CSS 4)
   cd frontend
   npm install
   
   # Backend (Express.js + MongoDB)
   cd ../backend
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Create environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   ```

4. **Database Setup**:
   ```bash
   # Start MongoDB and run seed script
   cd backend
   npm run seed
   ```

5. **Start Development Servers**:
   ```bash
   # Terminal 1: Backend (Port 5000)
   cd backend
   npm run dev
   
   # Terminal 2: Frontend (Port 3000)
   cd frontend
   npm run dev
   ```

6. **Open Application**:
   Navigate to `http://localhost:3000` in your browser.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with app router
- **React 18** - UI library with latest features
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **TypeScript 5** - Type-safe development
- **Lucide React** - Beautiful icon library

### Backend
- **Express.js** - Node.js web framework
- **MongoDB & Mongoose** - Database and ODM
- **TypeScript** - Type-safe server development
- **CORS** - Cross-origin resource sharing

## Usage

Users can search for produce items using the search bar, view a list of available produce, and see their locations on the supermarket map. 

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.