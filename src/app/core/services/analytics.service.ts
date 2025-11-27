import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardStats } from '../../models/loyalty.model';
import { Order } from '../../models/order.model';
import { InventoryItem } from '../../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private ordersUrl = 'http://localhost:3000/orders';
    private inventoryUrl = 'http://localhost:3000/inventory';

    constructor(private http: HttpClient) { }

    getDashboardStats(): Observable<DashboardStats> {
        return combineLatest([
            this.http.get<Order[]>(this.ordersUrl),
            this.http.get<InventoryItem[]>(this.inventoryUrl)
        ]).pipe(
            map(([orders, inventory]) => {
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                // Filter orders by date
                const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);
                const weekOrders = orders.filter(o => new Date(o.createdAt) >= weekStart);
                const monthOrders = orders.filter(o => new Date(o.createdAt) >= monthStart);

                // Calculate revenue
                const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
                const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);
                const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);

                // Best selling products
                const productSales = new Map<string, number>();
                orders.forEach(order => {
                    order.items.forEach((item: any) => {
                        const current = productSales.get(item.productName) || 0;
                        productSales.set(item.productName, current + item.quantity);
                    });
                });

                const bestSellingProducts = Array.from(productSales.entries())
                    .map(([productName, quantity]) => ({ productName, quantity }))
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 5);

                // Low stock items
                const lowStockItems = inventory.filter(item => item.lowStockAlert);

                // Recent orders
                const recentOrders = orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10);

                // Count unique customers (estimated from orders)
                const todayCustomers = todayOrders.length;

                return {
                    todayRevenue,
                    weekRevenue,
                    monthRevenue,
                    todayOrders: todayOrders.length,
                    todayCustomers,
                    bestSellingProducts,
                    recentOrders,
                    lowStockItems
                };
            })
        );
    }

    getRevenueTrend(days: number): Observable<{ date: string; revenue: number }[]> {
        return this.http.get<Order[]>(this.ordersUrl).pipe(
            map(orders => {
                const trend: { date: string; revenue: number }[] = [];
                const now = new Date();

                for (let i = days - 1; i >= 0; i--) {
                    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

                    const dayOrders = orders.filter(o => {
                        const orderDate = new Date(o.createdAt);
                        return orderDate >= dateStart && orderDate < dateEnd;
                    });

                    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);

                    trend.push({
                        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                        revenue
                    });
                }

                return trend;
            })
        );
    }
}
