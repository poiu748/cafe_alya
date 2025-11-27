import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryItem } from '../../../models/inventory.model';
import { InventoryFormComponent } from '../inventory-form/inventory-form.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, InventoryFormComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <h1>📦 Inventaire</h1>
        <button class="btn btn-primary" (click)="onAddInventoryItem()">+ Ajouter un article</button>
      </header>

      @if (inventory.length > 0) {
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Description</th>
                <th>Stock actuel</th>
                <th>Stock minimum</th>
                <th>Unité</th>
                <th>Coût unitaire</th>
                <th>Fournisseur</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (item of inventory; track item.id) {
                <tr [class.low-stock]="item.lowStockAlert">
                  <td><strong>{{item.name}}</strong></td>
                  <td>{{item.description}}</td>
                  <td>{{item.currentStock}}</td>
                  <td>{{item.minStock}}</td>
                  <td>{{item.unit}}</td>
                  <td>{{item.unitCost | number:'1.2-2'}}€</td>
                  <td>{{item.supplier || '-'}}</td>
                  <td>
                    <span class="badge" [class.badge-success]="!item.lowStockAlert" [class.badge-warning]="item.lowStockAlert">
                      {{item.lowStockAlert ? '⚠️ Stock faible' : '✓ OK'}}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="empty-state">
          <p>Aucun article en inventaire</p>
        </div>
      }

      @if (showAddModal) {
        <app-inventory-form (close)="onCloseModal()" (save)="onItemSaved()"></app-inventory-form>
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

    .low-stock {
      background-color: rgba(255, 152, 0, 0.05);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class InventoryListComponent implements OnInit {
  inventory: InventoryItem[] = [];
  showAddModal = false;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (inventory) => {
        this.inventory = inventory;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  onAddInventoryItem(): void {
    this.showAddModal = true;
  }

  onCloseModal(): void {
    this.showAddModal = false;
  }

  onItemSaved(): void {
    this.loadInventory();
  }
}
