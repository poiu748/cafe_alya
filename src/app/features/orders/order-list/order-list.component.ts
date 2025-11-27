import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';
import { AuthService } from '../../../core/services/auth.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import QRCode from 'qrcode';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderFormComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <h1>📋 Commandes</h1>
        @if (!isAdmin) {
          <button class="btn btn-primary" (click)="onAddOrder()">+ Nouvelle commande</button>
        }
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
                    <div class="action-buttons">
                      <button class="btn btn-secondary btn-sm" (click)="printOrder(order)">
                        🖨️ Imprimer
                      </button>
                      @if (order.status !== 'delivered' && order.status !== 'cancelled') {
                        <button class="btn btn-success btn-sm" (click)="markAsPaid(order)">
                          💳 Payer
                        </button>
                      }
                      <button class="btn btn-info btn-sm" (click)="generateOrderQR(order)">
                        📱 QR Code
                      </button>
                    </div>
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

      @if (showAddModal) {
        <app-order-form (close)="onCloseModal()" (save)="onOrderSaved()"></app-order-form>
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

    .action-buttons {
      display: flex;
      gap: 0.5rem;
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
  showAddModal = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
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

  onAddOrder(): void {
    this.showAddModal = true;
  }

  onCloseModal(): void {
    this.showAddModal = false;
  }

  onOrderSaved(): void {
    this.loadOrders();
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

  markAsPaid(order: Order): void {
    this.orderService.updateOrderStatus(order.id, 'delivered' as any).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  printOrder(order: Order): void {
    this.orderService.generatePDF(order);
  }

  async generateOrderQR(order: Order): Promise<void> {
    try {
      // Create order data in base64 to pass via URL
      const orderData = {
        orderNumber: order.orderNumber,
        type: order.type,
        tableNumber: order.tableNumber,
        items: order.items,
        total: order.total,
        createdAt: order.createdAt
      };

      const orderDataStr = btoa(JSON.stringify(orderData));
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port;
      const baseUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;

      // URL that will display the order PDF
      const orderUrl = `${baseUrl}/order-view?data=${orderDataStr}`;

      // Create canvas for QR code
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, orderUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2C1810',
          light: '#FFFFFF'
        }
      });

      // Create modal to display QR code
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
      `;

      const title = document.createElement('h3');
      title.textContent = `QR Code - Commande ${order.orderNumber}`;
      title.style.cssText = 'color: #2C1810; margin-bottom: 1rem;';

      const description = document.createElement('p');
      description.textContent = 'Scannez ce code pour voir le détail de la commande';
      description.style.cssText = 'color: #666; margin-bottom: 1rem; font-size: 0.9rem;';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fermer';
      closeBtn.style.cssText = `
        margin-top: 1rem;
        padding: 0.5rem 2rem;
        background: #D4AF37;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
      `;
      closeBtn.onclick = () => document.body.removeChild(modal);

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = '📥 Télécharger QR';
      downloadBtn.style.cssText = `
        margin-top: 1rem;
        margin-left: 0.5rem;
        padding: 0.5rem 2rem;
        background: #2C1810;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
      `;
      downloadBtn.onclick = () => {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qr-commande-${order.orderNumber}.png`;
        link.href = url;
        link.click();
      };

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(canvas);
      content.appendChild(document.createElement('br'));
      content.appendChild(downloadBtn);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);

      // Close on click outside
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };

    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Erreur lors de la génération du QR code');
    }
  }
}

