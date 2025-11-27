import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, ProductCategory } from '../../../models/product.model';

@Component({
    selector: 'app-client-menu',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="menu-container">
      <div class="categories">
        <button 
          class="category-btn" 
          [class.active]="selectedCategory === 'all'"
          (click)="filterCategory('all')">
          Tout
        </button>
        <button 
          class="category-btn" 
          [class.active]="selectedCategory === Category.COFFEE"
          (click)="filterCategory(Category.COFFEE)">
          Cafés
        </button>
        <button 
          class="category-btn" 
          [class.active]="selectedCategory === Category.TEA"
          (click)="filterCategory(Category.TEA)">
          Thés
        </button>
        <button 
          class="category-btn" 
          [class.active]="selectedCategory === Category.PASTRY"
          (click)="filterCategory(Category.PASTRY)">
          Pâtisseries
        </button>
      </div>

      <div class="products-grid">
        @for (product of filteredProducts; track product.id) {
          <div class="product-card">
            <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
            <div class="product-info">
              <h3>{{product.name}}</h3>
              <p>{{product.description}}</p>
              <div class="product-footer">
                <span class="price">{{product.price | number:'1.2-2'}}€</span>
                <button class="add-btn" (click)="addToCart(product)">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .menu-container {
      padding: 1rem 0;
    }

    .categories {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .category-btn {
      padding: 0.5rem 1.5rem;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .category-btn.active, .category-btn:hover {
      background: var(--coffee-gold);
      color: white;
      border-color: var(--coffee-gold);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .product-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .product-info p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-weight: bold;
      color: var(--coffee-gold);
      font-size: 1.2rem;
    }

    .add-btn {
      padding: 0.5rem 1rem;
      background: var(--coffee-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .add-btn:hover {
      background: var(--coffee-dark);
    }
  `]
})
export class ClientMenuComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    selectedCategory: string = 'all';
    Category = ProductCategory;

    constructor(
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit() {
        this.productService.getProducts().subscribe(products => {
            this.products = products.filter(p => p.available);
            this.filterCategory('all');
        });
    }

    filterCategory(category: string) {
        this.selectedCategory = category;
        if (category === 'all') {
            this.filteredProducts = this.products;
        } else {
            this.filteredProducts = this.products.filter(p => p.category === category);
        }
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
