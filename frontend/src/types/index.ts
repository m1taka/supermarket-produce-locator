export interface Location {
    aisle: string;
    section: string;
    shelf: string;
    coordinates?: {
        x: number;
        y: number;
    };
}

export interface NutritionalInfo {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
}

export interface Produce {
    _id: string;
    name: string;
    category: string;
    subcategory?: string;
    price: number;
    location: Location;
    stock: number;
    description?: string;
    image?: string;
    barcode?: string;
    brand?: string;
    unit: string;
    nutritionalInfo?: NutritionalInfo;
    isOrganic: boolean;
    isLocal: boolean;
    seasonality?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Store {
    _id: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    phone: string;
    email?: string;
    hours: {
        [key: string]: {
            open: string;
            close: string;
            closed?: boolean;
        };
    };
    layout: {
        totalAisles: number;
        aisleLength: number;
        aisleWidth: number;
        storeWidth: number;
        storeHeight: number;
    };
    departments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

export interface SearchFilters {
    category?: string;
    aisle?: string;
    inStock?: boolean;
    organic?: boolean;
    local?: boolean;
    priceRange?: {
        min: number;
        max: number;
    };
}

export interface ProduceListProps {
    produceItems: Produce[];
    loading?: boolean;
    error?: string;
    onItemClick?: (item: Produce) => void;
}

export interface ProduceMapProps {
    produceItems: Produce[];
    selectedItem?: Produce | null;
    onLocationClick?: (location: Location) => void;
}

export interface SearchBarProps {
    onSearch: (query: string) => void;
    onFiltersChange?: (filters: SearchFilters) => void;
    placeholder?: string;
    loading?: boolean;
}

export interface FilterPanelProps {
    categories: string[];
    aisles: string[];
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export interface ProduceCardProps {
    item: Produce;
    onClick?: (item: Produce) => void;
    showLocation?: boolean;
}

export const CATEGORIES = [
    'fruits',
    'vegetables', 
    'herbs',
    'organic',
    'berries',
    'citrus',
    'tropical',
    'root_vegetables',
    'leafy_greens'
] as const;

export const UNITS = [
    'lb',
    'kg', 
    'each',
    'bunch',
    'bag',
    'container',
    'oz',
    'gram'
] as const;

export type Category = typeof CATEGORIES[number];
export type Unit = typeof UNITS[number];