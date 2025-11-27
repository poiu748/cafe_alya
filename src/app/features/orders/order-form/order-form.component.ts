import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderType, OrderItem } from '../../../models/order.model';
import { Product } from '../../../models/product.model';

@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nouvelle commande</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <div class="form-container">
          <!-- Left side: Product Selection -->
          <div class="product-selection">
            <h3>Produits</h3>
            <div class="product-grid">
              @for (product of products; track product.id) {
                <div class="product-item" (click)="addToOrder(product)">
                  <div class="product-name">{{product.name}}</div>
                  <div class="product-price">{{product.price | number:'1.2-2'}}€</div>
                </div>
              }
            </div>
          </div>

          <!-- Right side: Order Details -->
          <div class="order-details">
            <form (ngSubmit)="onSubmit()" #orderForm="ngForm">
              <div class="form-group">
                <label>Type de commande</label>
                <div class="radio-group">
                  <label>
                    <input type="radio" name="type" [(ngModel)]="orderData.type" [value]="OrderType.DINE_IN"> Sur place
                  </label>
                  <label>
                    <input type="radio" name="type" [(ngModel)]="orderData.type" [value]="OrderType.TAKEAWAY"> À emporter
                  </label>
                </div>
              </div>

              @if (orderData.type === OrderType.DINE_IN) {
                <div class="form-group">
                  <label for="tableNumber">Numéro de table</label>
                  <input type="number" id="tableNumber" name="tableNumber" [(ngModel)]="orderData.tableNumber" class="form-control" required>
                </div>
              }

              <div class="order-items">
                <h3>Articles</h3>
                @if (orderData.items.length === 0) {
                  <p class="empty-cart">Aucun article sélectionné</p>
                } @else {
                  <div class="items-list">
                    @for (item of orderData.items; track item.productId) {
                      <div class="order-item">
                        <div class="item-info">
                          <span class="item-name">{{item.productName}}</span>
                          <span class="item-price">{{item.unitPrice | number:'1.2-2'}}€</span>
                        </div>
                        <div class="item-actions">
                          <button type="button" class="qty-btn" (click)="updateQuantity(item, -1)">-</button>
                          <span>{{item.quantity}}</span>
                          <button type="button" class="qty-btn" (click)="updateQuantity(item, 1)">+</button>
                          <button type="button" class="remove-btn" (click)="removeItem(item)">×</button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>

              <div class="order-summary">
                <div class="total-row">
                  <span>Total</span>
                  <span class="total-amount">{{calculateTotal() | number:'1.2-2'}}€</span>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="onCancel()">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="!isValid()">Créer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 900px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .form-container {
      display: flex;
      gap: 2rem;
      flex: 1;
      overflow: hidden;
    }

    .product-selection {
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid var(--border-color);
      padding-right: 1rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }

    .product-item {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid var(--border-color);
      transition: all 0.2s;
    }

    .product-item:hover {
      border-color: var(--coffee-gold);
      transform: translateY(-2px);
    }

    .product-name {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .product-price {
      color: var(--coffee-gold);
      font-weight: bold;
    }

    .order-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .radio-group {
      display: flex;
      gap: 1rem;
    }

    .order-items {
      flex: 1;
      margin-top: 1rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: var(--bg-primary);
      border-radius: 4px;
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: var(--coffee-primary);
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.2rem;
    }

    .order-summary {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .total-amount {
      color: var(--coffee-gold);
    }

    .modal-footer {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class OrderFormComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();

    OrderType = OrderType;
    products: Product[] = [];

    orderData = {
        type: OrderType.DINE_IN,
        tableNumber: undefined as number | undefined,
        items: [] as OrderItem[],
        notes: ''
    };

    constructor(
        private orderService: OrderService,
        private productService: ProductService
    ) { }

    ngOnInit() {
        this.productService.getProducts().subscribe(products => {
            this.products = products.filter(p => p.available);
        });
    }

    addToOrder(product: Product) {
        const existingItem = this.orderData.items.find(i => i.productId === product.id);

        if (existingItem) {
            existingItem.quantity++;
            existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
        } else {
            this.orderData.items.push({
                productId: product.id,
                productName: product.name,
                quantity: 1,
                unitPrice: product.price,
                subtotal: product.price
            });
        }
    }

    updateQuantity(item: OrderItem, change: number) {
        item.quantity += change;
        if (item.quantity <= 0) {
            this.removeItem(item);
        } else {
            item.subtotal = item.quantity * item.unitPrice;
        }
    }

    removeItem(item: OrderItem) {
        this.orderData.items = this.orderData.items.filter(i => i !== item);
    }

    calculateTotal(): number {
        return this.orderData.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    isValid(): boolean {
        if (this.orderData.items.length === 0) return false;
        if (this.orderData.type === OrderType.DINE_IN && !this.orderData.tableNumber) return false;
        return true;
    }

    onSubmit() {
        if (this.isValid()) {
            this.orderService.createOrder(this.orderData).subscribe(() => {
                this.save.emit();
                this.close.emit();
            });
        }
    }

    onCancel() {
        this.close.emit();
    }
}
