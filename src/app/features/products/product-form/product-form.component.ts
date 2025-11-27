import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../models/product.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ajouter un produit</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #productForm="ngForm">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" id="name" name="name" [(ngModel)]="product.name" required class="form-control">
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" [(ngModel)]="product.description" required class="form-control"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Prix (€)</label>
              <input type="number" id="price" name="price" [(ngModel)]="product.price" required min="0" step="0.1" class="form-control">
            </div>

            <div class="form-group">
              <label for="category">Catégorie</label>
              <select id="category" name="category" [(ngModel)]="product.category" required class="form-control">
                <option [value]="Category.COFFEE">Café</option>
                <option [value]="Category.TEA">Thé</option>
                <option [value]="Category.PASTRY">Pâtisserie</option>
                <option [value]="Category.FOOD">Nourriture</option>
                <option [value]="Category.DRINK">Boisson</option>
                <option [value]="Category.MERCHANDISE">Marchandise</option>
                <option [value]="Category.OTHER">Autre</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="imageUrl">URL de l'image</label>
            <input type="text" id="imageUrl" name="imageUrl" [(ngModel)]="product.imageUrl" class="form-control">
          </div>

          <div class="form-check">
            <input type="checkbox" id="available" name="available" [(ngModel)]="product.available">
            <label for="available">Disponible</label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!productForm.valid">Ajouter</button>
          </div>
        </form>
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
      width: 100%;
      max-width: 500px;
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

    .form-group {
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class ProductFormComponent {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();

    Category = ProductCategory;
    product: Partial<Product> = {
        name: '',
        description: '',
        price: 0,
        category: ProductCategory.COFFEE,
        imageUrl: '',
        available: true
    };

    constructor(private productService: ProductService) { }

    onSubmit() {
        this.productService.createProduct(this.product).subscribe(() => {
            this.save.emit();
            this.close.emit();
        });
    }

    onCancel() {
        this.close.emit();
    }
}
