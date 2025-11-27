import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { LoyaltyCard } from '../../../models/loyalty.model';

@Component({
    selector: 'app-loyalty-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page">
      <header class="page-header">
        <h1>🎁 Programme de Fidélité</h1>
        <button class="btn btn-primary">+ Nouvelle carte</button>
      </header>

      @if (cards.length > 0) {
        <div class="grid grid-3">
          @for (card of cards; track card.id) {
            <div class="card loyalty-card" [class]="'tier-' + card.tier">
              <div class="card-tier">
                {{getTierLabel(card.tier)}}
              </div>
              <div class="card-content">
                <h3>{{card.customerName}}</h3>
                <p class="customer-info">
                  📧 {{card.customerEmail}}<br>
                  📞 {{card.customerPhone}}
                </p>
                <div class="points-section">
                  <div class="points">
                    <span class="points-value">{{card.points}}</span>
                    <span class="points-label">Points</span>
                  </div>
                  <div class="total-spent">
                    <span class="spent-value">{{card.totalSpent | number:'1.2-2'}}€</span>
                    <span class="spent-label">Total dépensé</span>
                  </div>
                </div>
                <p class="last-visit">
                  Dernière visite: {{card.lastVisit | date:'dd/MM/yyyy'}}
                </p>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>Aucune carte de fidélité enregistrée</p>
        </div>
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

    .loyalty-card {
      position: relative;
      overflow: hidden;
    }

    .card-tier {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.5rem 1rem;
      background: var(--coffee-gold);
      color: var(--coffee-dark);
      font-weight: 600;
      font-size: 0.875rem;
      border-bottom-left-radius: 8px;
    }

    .tier-silver .card-tier {
      background: #c0c0c0;
    }

    .tier-gold .card-tier {
      background: #ffd700;
    }

    .tier-platinum .card-tier {
      background: #e5e4e2;
    }

    .card-content {
      padding-top: 1rem;
    }

    .card-content h3 {
      margin-bottom: 0.5rem;
    }

    .customer-info {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .points-section {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: var(--bg-tertiary);
      border-radius: 8px;
    }

    .points, .total-spent {
      display: flex;
      flex-direction: column;
    }

    .points-value, .spent-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--coffee-gold);
    }

    .points-label, .spent-label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .last-visit {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class LoyaltyListComponent implements OnInit {
    cards: LoyaltyCard[] = [];

    constructor(private loyaltyService: LoyaltyService) { }

    ngOnInit(): void {
        this.loyaltyService.getCards().subscribe({
            next: (cards) => {
                this.cards = cards;
            },
            error: (error) => {
                console.error('Error loading loyalty cards:', error);
            }
        });
    }

    getTierLabel(tier: string): string {
        const labelMap: { [key: string]: string } = {
            'bronze': '🥉 Bronze',
            'silver': '🥈 Silver',
            'gold': '🥇 Gold',
            'platinum': '💎 Platinum'
        };
        return labelMap[tier] || tier;
    }
}
