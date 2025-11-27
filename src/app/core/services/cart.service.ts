import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.model';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    addToCart(product: Product) {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
            this.cartItemsSubject.next([...currentItems]);
        } else {
            this.cartItemsSubject.next([...currentItems, { product, quantity: 1 }]);
        }
    }

    removeFromCart(productId: string) {
        const currentItems = this.cartItemsSubject.value;
        const updatedItems = currentItems.filter(item => item.product.id !== productId);
        this.cartItemsSubject.next(updatedItems);
    }

    updateQuantity(productId: string, quantity: number) {
        const currentItems = this.cartItemsSubject.value;
        const item = currentItems.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.cartItemsSubject.next([...currentItems]);
            }
        }
    }

    clearCart() {
        this.cartItemsSubject.next([]);
    }

    get total(): number {
        return this.cartItemsSubject.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
}
