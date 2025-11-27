import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DashboardStats } from '../../models/loyalty.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>📊 Tableau de Bord</h1>
        <p>Vue d'ensemble de votre café</p>
      </header>

      @if (stats) {
        <div class="stats-grid grid grid-4">
          <div class="stat-card card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>{{stats.todayRevenue | number:'1.2-2'}}€</h3>
              <p>Revenus du jour</p>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>{{stats.todayOrders}}</h3>
              <p>Commandes du jour</p>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>{{stats.todayCustomers}}</h3>
              <p>Clients du jour</p>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h3>{{stats.weekRevenue | number:'1.2-2'}}€</h3>
              <p>Revenus hebdomadaires</p>
            </div>
          </div>
        </div>

        <div class="grid grid-2 mt-4">
          <div class="card">
            <div class="card-header">🏆 Produits les plus vendus</div>
            @if (stats.bestSellingProducts && stats.bestSellingProducts.length > 0) {
              <table class="table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité vendue</th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of stats.bestSellingProducts; track product.productName) {
                    <tr>
                      <td>{{product.productName}}</td>
                      <td>{{product.quantity}}</td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p class="text-muted">Aucune vente enregistrée</p>
            }
          </div>

          <div class="card">
            <div class="card-header">⚠️ Stock Faible</div>
            @if (stats.lowStockItems && stats.lowStockItems.length > 0) {
              <table class="table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of stats.lowStockItems; track item.id) {
                    <tr>
                      <td>{{item.name}}</td>
                      <td><span class="badge badge-warning">{{item.currentStock}} {{item.unit}}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p class="text-muted">Tous les stocks sont suffisants ✓</p>
            }
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">🕒 Commandes Récentes</div>
          @if (stats.recentOrders && stats.recentOrders.length > 0) {
            <table class="table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (order of stats.recentOrders.slice(0, 5); track order.id) {
                  <tr>
                    <td>{{order.orderNumber}}</td>
                    <td>{{order.type}}</td>
                    <td>{{order.total | number:'1.2-2'}}€</td>
                    <td>
                      <span [class]="'badge badge-' + getStatusClass(order.status)">
                        {{order.status}}
                      </span>
                    </td>
                    <td>{{order.createdAt | date:'short'}}</td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <p class="text-muted">Aucune commande récente</p>
          }
        </div>
      } @else {
        <div class="spinner"></div>
      }
    </div>
  `,
    styles: [`
    .dashboard {
      padding: 2rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: var(--text-muted);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      color: var(--coffee-gold);
      margin-bottom: 0.25rem;
    }

    .stat-content p {
      font-size: 0.95rem;
      color: var(--text-muted);
       margin-bottom: 0;
    }

    .text-muted {
      color: var(--text-muted);
      padding: 1rem;
      text-align: center;
    }

    .mt-4 {
      margin-top: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats | null = null;

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        this.loadDashboardStats();
    }

    loadDashboardStats(): void {
        this.analyticsService.getDashboardStats().subscribe({
            next: (stats) => {
                this.stats = stats;
            },
            error: (error) => {
                console.error('Error loading dashboard stats:', error);
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
}
