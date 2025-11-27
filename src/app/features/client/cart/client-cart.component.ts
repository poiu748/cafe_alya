import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderType } from '../../../models/order.model';

@Component({
    selector: 'app-client-cart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="cart-container">
      <h2>Votre Panier</h2>

      @if ((cartService.cartItems$ | async)?.length === 0) {
        <div class="empty-cart">
          <p>Votre panier est vide</p>
          <button class="btn btn-primary" (click)="goToMenu()">Voir le menu</button>
        </div>
      } @else {
        <div class="cart-items">
          @for (item of cartService.cartItems$ | async; track item.product.id) {
            <div class="cart-item">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-image">
              <div class="item-details">
                <h3>{{item.product.name}}</h3>
                <p class="price">{{item.product.price | number:'1.2-2'}}€</p>
              </div>
              <div class="item-actions">
                <button class="qty-btn" (click)="updateQuantity(item.product.id, item.quantity - 1)">-</button>
                <span class="quantity">{{item.quantity}}</span>
                <button class="qty-btn" (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
              </div>
              <div class="item-total">
                {{(item.product.price * item.quantity) | number:'1.2-2'}}€
              </div>
              <button class="remove-btn" (click)="removeItem(item.product.id)">×</button>
            </div>
          }
        </div>

        <div class="cart-summary">
          <div class="total-row">
            <span>Total</span>
            <span class="total-amount">{{cartService.total | number:'1.2-2'}}€</span>
          </div>
          <button class="btn btn-primary checkout-btn" (click)="checkout()">
            Commander
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .cart-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem;
      background: var(--bg-secondary);
      border-radius: 12px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .cart-item {
      display: flex;
      align-items: center;
      background: var(--bg-secondary);
      padding: 1rem;
      border-radius: 8px;
      gap: 1rem;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
    }

    .item-details h3 {
      margin: 0;
      font-size: 1rem;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-primary);
      padding: 0.25rem;
      border-radius: 4px;
    }

    .qty-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: var(--coffee-primary);
      color: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quantity {
      min-width: 20px;
      text-align: center;
      font-weight: bold;
    }

    .item-total {
      font-weight: bold;
      color: var(--coffee-gold);
      min-width: 80px;
      text-align: right;
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 0.5rem;
    }

    .cart-summary {
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 12px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }

    .total-amount {
      color: var(--coffee-gold);
    }

    .checkout-btn {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
    }
  `]
})
export class ClientCartComponent {
    constructor(
        public cartService: CartService,
        private orderService: OrderService,
        private router: Router
    ) { }

    updateQuantity(productId: string, quantity: number) {
        this.cartService.updateQuantity(productId, quantity);
    }

    removeItem(productId: string) {
        this.cartService.removeFromCart(productId);
    }

    goToMenu() {
        this.router.navigate(['/client/menu']);
    }

    checkout() {
        // In a real app, this would collect table number etc.
        // For now, we'll create a simple order
        const items = [];
        // We need to subscribe to get current items or assume we have them
        // Since we are using the service, let's just use a simple approach
        // Ideally we should get the items from the service synchronously or via subscription
        // But for this demo, let's assume valid state

        // Note: This is a simplified checkout. 
        // In a real scenario we would need to map CartItems to OrderItems properly
        // and handle the observable.

        alert('Commande envoyée ! (Simulation)');
        this.cartService.clearCart();
        this.router.navigate(['/client/menu']);
    }
}
