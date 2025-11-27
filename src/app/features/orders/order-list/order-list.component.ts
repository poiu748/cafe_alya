import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page">
      <header class="page-header">
        <h1>📋 Commandes</h1>
        <button class="btn btn-primary">+ Nouvelle commande</button>
      </header>

      @if (orders.length > 0) {
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Type</th>
                <th>Table</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders; track order.id) {
                <tr>
                  <td>{{order.orderNumber}}</td>
                  <td>{{order.type}}</td>
                  <td>{{order.tableNumber || '-'}}</td>
                  <td>{{order.items.length}}</td>
                  <td>{{order.total | number:'1.2-2'}}€</td>
                  <td>
                    <span [class]="'badge badge-' + getStatusClass(order.status)">
                      {{getStatusLabel(order.status)}}
                    </span>
                  </td>
                  <td>{{order.createdAt | date:'short'}}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" (click)="printOrder(order)">
                      🖨️ Imprimer
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="empty-state">
          <p>Aucune commande trouvée</p>
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

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.orderService.getOrders().subscribe({
            next: (orders) => {
                this.orders = orders.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            },
            error: (error) => {
                console.error('Error loading orders:', error);
            }
        });
    }

    getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            'pending': 'warning',
            'preparing': 'info',
            'ready': 'success',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return statusMap[status] || 'info';
    }

    getStatusLabel(status: string): string {
        const labelMap: { [key: string]: string } = {
            'pending': 'En attente',
            'preparing': 'En préparation',
            'ready': 'Prêt',
            'delivered': 'Livré',
            'cancelled': 'Annulé'
        };
        return labelMap[status] || status;
    }

    printOrder(order: Order): void {
        this.orderService.generatePDF(order);
    }
}
