import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryItem, InventoryUnit } from '../../../models/inventory.model';

@Component({
    selector: 'app-inventory-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ajouter un article</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #inventoryForm="ngForm">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" id="name" name="name" [(ngModel)]="item.name" required class="form-control">
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" [(ngModel)]="item.description" class="form-control"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="currentStock">Stock actuel</label>
              <input type="number" id="currentStock" name="currentStock" [(ngModel)]="item.currentStock" required min="0" class="form-control">
            </div>

            <div class="form-group">
              <label for="minStock">Stock minimum</label>
              <input type="number" id="minStock" name="minStock" [(ngModel)]="item.minStock" required min="0" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="unit">Unité</label>
              <select id="unit" name="unit" [(ngModel)]="item.unit" required class="form-control">
                <option [value]="Unit.KG">Kg</option>
                <option [value]="Unit.LITER">Litre</option>
                <option [value]="Unit.UNIT">Unité</option>
                <option [value]="Unit.PACK">Paquet</option>
              </select>
            </div>

            <div class="form-group">
              <label for="unitCost">Coût unitaire (€)</label>
              <input type="number" id="unitCost" name="unitCost" [(ngModel)]="item.unitCost" required min="0" step="0.01" class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label for="supplier">Fournisseur</label>
            <input type="text" id="supplier" name="supplier" [(ngModel)]="item.supplier" class="form-control">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!inventoryForm.valid">Ajouter</button>
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class InventoryFormComponent {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();

    Unit = InventoryUnit;
    item: Partial<InventoryItem> = {
        name: '',
        description: '',
        currentStock: 0,
        minStock: 0,
        unit: InventoryUnit.UNIT,
        unitCost: 0,
        supplier: ''
    };

    constructor(private inventoryService: InventoryService) { }

    onSubmit() {
        this.inventoryService.createInventoryItem(this.item).subscribe(() => {
            this.save.emit();
            this.close.emit();
        });
    }

    onCancel() {
        this.close.emit();
    }
}
