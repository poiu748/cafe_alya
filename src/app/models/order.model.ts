// Order status
export enum OrderStatus {
    PENDING = 'pending',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

// Order type
export enum OrderType {
    DINE_IN = 'dine-in',
    TAKEAWAY = 'takeaway'
}

// Order item
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// Order interface
export interface Order {
    id: string;
    orderNumber: string;
    type: OrderType;
    tableNumber?: number;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
