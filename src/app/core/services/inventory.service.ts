import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InventoryItem, StockMovement } from '../../models/inventory.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private apiUrl = 'http://localhost:3000/inventory';
    private movementsUrl = 'http://localhost:3000/stockMovements';
    private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
    public inventory$ = this.inventorySubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.loadInventory();
    }

    loadInventory(): void {
        this.http.get<InventoryItem[]>(this.apiUrl).subscribe(
            items => this.inventorySubject.next(items)
        );
    }

    getInventory(): Observable<InventoryItem[]> {
        return this.http.get<InventoryItem[]>(this.apiUrl);
    }

    getInventoryItem(id: string): Observable<InventoryItem> {
        return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
    }

    getLowStockItems(): Observable<InventoryItem[]> {
        return this.http.get<InventoryItem[]>(`${this.apiUrl}?lowStockAlert=true`);
    }

    createInventoryItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
        const newItem: InventoryItem = {
            id: this.generateId(),
            name: item.name || '',
            description: item.description || '',
            currentStock: item.currentStock || 0,
            minStock: item.minStock || 0,
            unit: item.unit!,
            unitCost: item.unitCost || 0,
            supplier: item.supplier,
            lowStockAlert: (item.currentStock || 0) <= (item.minStock || 0),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return this.http.post<InventoryItem>(this.apiUrl, newItem).pipe(
            tap(() => this.loadInventory())
        );
    }

    updateInventoryItem(id: string, item: Partial<InventoryItem>): Observable<InventoryItem> {
        const updatedItem = {
            ...item,
            updatedAt: new Date(),
            lowStockAlert: (item.currentStock || 0) <= (item.minStock || 0)
        };
        return this.http.patch<InventoryItem>(`${this.apiUrl}/${id}`, updatedItem).pipe(
            tap(() => this.loadInventory())
        );
    }

    deleteInventoryItem(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadInventory())
        );
    }

    // Stock movements
    addStock(itemId: string, quantity: number, reason: string): Observable<InventoryItem> {
        return this.getInventoryItem(itemId).pipe(
            tap(item => {
                const newStock = item.currentStock + quantity;
                this.updateInventoryItem(itemId, { currentStock: newStock }).subscribe();

                const movement: StockMovement = {
                    id: this.generateId(),
                    itemId,
                    quantity,
                    type: 'in',
                    reason,
                    createdBy: this.authService.currentUserValue?.id || 'unknown',
                    createdAt: new Date()
                };
                this.http.post(this.movementsUrl, movement).subscribe();
            })
        );
    }

    removeStock(itemId: string, quantity: number, reason: string): Observable<InventoryItem> {
        return this.getInventoryItem(itemId).pipe(
            tap(item => {
                const newStock = Math.max(0, item.currentStock - quantity);
                this.updateInventoryItem(itemId, { currentStock: newStock }).subscribe();

                const movement: StockMovement = {
                    id: this.generateId(),
                    itemId,
                    quantity,
                    type: 'out',
                    reason,
                    createdBy: this.authService.currentUserValue?.id || 'unknown',
                    createdAt: new Date()
                };
                this.http.post(this.movementsUrl, movement).subscribe();
            })
        );
    }

    getStockMovements(itemId?: string): Observable<StockMovement[]> {
        const url = itemId ? `${this.movementsUrl}?itemId=${itemId}` : this.movementsUrl;
        return this.http.get<StockMovement[]>(url);
    }

    private generateId(): string {
        return 'inv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
