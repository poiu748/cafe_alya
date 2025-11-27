import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Order, OrderItem, OrderStatus, OrderType } from '../../models/order.model';
import { AuthService } from './auth.service';
import jsPDF from 'jspdf';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:3000/orders';
    private ordersSubject = new BehaviorSubject<Order[]>([]);
    public orders$ = this.ordersSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.loadOrders();
    }

    loadOrders(): void {
        this.http.get<Order[]>(this.apiUrl).subscribe(
            orders => this.ordersSubject.next(orders)
        );
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    createOrder(orderData: {
        type: OrderType;
        tableNumber?: number;
        items: OrderItem[];
        notes?: string;
    }): Observable<Order> {
        const subtotal = orderData.items.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        const newOrder: Order = {
            id: this.generateId(),
            orderNumber: this.generateOrderNumber(),
            type: orderData.type,
            tableNumber: orderData.tableNumber,
            items: orderData.items,
            subtotal,
            tax,
            total,
            status: OrderStatus.PENDING,
            notes: orderData.notes,
            createdBy: this.authService.currentUserValue?.id || 'unknown',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.http.post<Order>(this.apiUrl, newOrder).pipe(
            tap(() => this.loadOrders())
        );
    }

    updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
        return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status, updatedAt: new Date() }).pipe(
            tap(() => this.loadOrders())
        );
    }

    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadOrders())
        );
    }

    // Generate PDF receipt
    generatePDF(order: Order): void {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('CoffeeManager', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Receipt', 105, 30, { align: 'center' });

        // Order info
        doc.setFontSize(10);
        doc.text(`Order #: ${order.orderNumber}`, 20, 45);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 52);
        doc.text(`Type: ${order.type}`, 20, 59);
        if (order.tableNumber) {
            doc.text(`Table: ${order.tableNumber}`, 20, 66);
        }

        // Items
        let y = 80;
        doc.text('Item', 20, y);
        doc.text('Qty', 120, y);
        doc.text('Price', 150, y);
        doc.text('Total', 180, y);
        y += 7;

        order.items.forEach((item: OrderItem) => {
            doc.text(item.productName, 20, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(`$${item.unitPrice.toFixed(2)}`, 150, y);
            doc.text(`$${item.subtotal.toFixed(2)}`, 180, y);
            y += 7;
        });

        // Totals
        y += 10;
        doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 150, y);
        y += 7;
        doc.text(`Tax: $${order.tax.toFixed(2)}`, 150, y);
        y += 7;
        doc.setFontSize(12);
        doc.text(`Total: $${order.total.toFixed(2)}`, 150, y);

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for your visit!', 105, 280, { align: 'center' });

        // Save
        doc.save(`order-${order.orderNumber}.pdf`);
    }

    private generateId(): string {
        return 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    private generateOrderNumber(): string {
        const date = new Date();
        const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${num}`;
    }
}
