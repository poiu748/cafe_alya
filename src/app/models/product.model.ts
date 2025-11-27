// Product categories
export enum ProductCategory {
    COFFEE = 'coffee',
    TEA = 'tea',
    PASTRY = 'pastry',
    SANDWICH = 'sandwich',
    JUICE = 'juice',
    FOOD = 'food',
    DRINK = 'drink',
    MERCHANDISE = 'merchandise',
    OTHER = 'other'
}

// Product interface
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl: string;
    available: boolean;
    promotion?: Promotion;
    createdAt: Date;
    updatedAt: Date;
}

// Promotion interface
export interface Promotion {
    id: string;
    discountPercent: number;
    startDate: Date;
    endDate: Date;
    active: boolean;
}
