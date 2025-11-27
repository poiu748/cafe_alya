import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { LoyaltyCard } from '../../../models/loyalty.model';

@Component({
    selector: 'app-loyalty-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nouvelle carte de fidélité</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loyaltyForm="ngForm">
          <div class="form-group">
            <label for="customerName">Nom du client</label>
            <input type="text" id="customerName" name="customerName" [(ngModel)]="card.customerName" required class="form-control">
          </div>

          <div class="form-group">
            <label for="customerEmail">Email</label>
            <input type="email" id="customerEmail" name="customerEmail" [(ngModel)]="card.customerEmail" required email class="form-control">
          </div>

          <div class="form-group">
            <label for="customerPhone">Téléphone</label>
            <input type="tel" id="customerPhone" name="customerPhone" [(ngModel)]="card.customerPhone" required class="form-control">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!loyaltyForm.valid">Créer la carte</button>
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
export class LoyaltyFormComponent {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();

    card: Partial<LoyaltyCard> = {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        points: 0,
        totalSpent: 0,
        tier: 'bronze',
        joinDate: new Date(),
        lastVisit: new Date()
    };

    constructor(private loyaltyService: LoyaltyService) { }

    onSubmit() {
        this.loyaltyService.createCard(this.card).subscribe(() => {
            this.save.emit();
            this.close.emit();
        });
    }

    onCancel() {
        this.close.emit();
    }
}
