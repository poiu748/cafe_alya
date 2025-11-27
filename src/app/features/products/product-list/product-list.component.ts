import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <h1>☕ Produits</h1>
        <button class="btn btn-primary" (click)="onAddProduct()">+ Ajouter un produit</button>
      </header>

      @if (products.length > 0) {
        <div class="grid grid-3">
          @for (product of products; track product.id) {
            <div class="card product-card">
              <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
              <div class="product-info">
                <h3>{{product.name}}</h3>
                <p>{{product.description}}</p>
                <div class="product-footer">
                  <span class="price">{{product.price | number:'1.2-2'}}€</span>
                  <span class="badge" [class.badge-success]="product.available" [class.badge-danger]="!product.available">
                    {{product.available ? 'Disponible' : 'Indisponible'}}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>Aucun produit trouvé</p>
        </div>
      }

      @if (showAddModal) {
        <app-product-form (close)="onCloseModal()" (save)="onProductSaved()"></app-product-form>
      }
    </div>
  `,
  styles: [`
    .page {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .product-card {
      overflow: hidden;
      padding: 0;
    }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin-bottom: 0.5rem;
    }

    .product-info p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--coffee-gold);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  showAddModal = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onAddProduct(): void {
    this.showAddModal = true;
  }

  onCloseModal(): void {
    this.showAddModal = false;
  }

  onProductSaved(): void {
    this.loadProducts();
  }
}
