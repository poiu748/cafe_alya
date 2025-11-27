// Customer loyalty card
export interface LoyaltyCard {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    points: number;
    totalSpent: number;
    joinDate: Date;
    lastVisit: Date;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Loyalty transaction
export interface LoyaltyTransaction {
    id: string;
    cardId: string;
    orderId: string;
    pointsEarned: number;
    amount: number;
    date: Date;
}

// Dashboard stats
export interface DashboardStats {
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    todayOrders: number;
    todayCustomers: number;
    bestSellingProducts: { productName: string; quantity: number }[];
    recentOrders: any[];
    lowStockItems: any[];
}
