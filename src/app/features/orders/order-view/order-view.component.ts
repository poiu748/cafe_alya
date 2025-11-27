import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
    selector: 'app-order-view',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="order-view-container">
      @if (orderData) {
        <div class="order-card">
          <div class="order-header">
            <h1>☕ Commande {{orderData.orderNumber}}</h1>
            <p class="order-type">{{orderData.type}}</p>
            @if (orderData.tableNumber) {
              <p class="table-number">Table: {{orderData.tableNumber}}</p>
            }
          </div>

          <div class="order-items">
            <h3>Articles</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                @for (item of orderData.items; track $index) {
                  <tr>
                    <td>{{item.productName}}</td>
                    <td>{{item.quantity}}</td>
                    <td>{{item.unitPrice | number:'1.2-2'}}€</td>
                    <td>{{item.subtotal | number:'1.2-2'}}€</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="order-total">
            <h2>Total: {{orderData.total | number:'1.2-2'}}€</h2>
          </div>

          <div class="order-footer">
            <p class="order-date">Date: {{orderData.createdAt | date:'medium'}}</p>
            <button class="btn btn-primary" (click)="downloadPDF()">📥 Télécharger PDF</button>
          </div>
        </div>
      } @else {
        <div class="error">
          <h2>❌ Commande non trouvée</h2>
          <p>Impossible de charger les informations de la commande.</p>
        </div>
      }
    </div>
  `,
    styles: [`
    .order-view-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%);
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .order-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .order-header {
      text-align: center;
      border-bottom: 3px solid #D4AF37;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }

    .order-header h1 {
      color: #2C1810;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .order-type {
      color: #D4AF37;
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .table-number {
      color: #666;
      font-size: 1rem;
    }

    .order-items h3 {
      color: #2C1810;
      margin-bottom: 1rem;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }

    .items-table th {
      background: #2C1810;
      color: white;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
    }

    .items-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #eee;
    }

    .items-table tr:hover {
      background: #f8f8f8;
    }

    .order-total {
      background: linear-gradient(135deg, #D4AF37 0%, #b8941f 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      margin: 2rem 0;
    }

    .order-total h2 {
      margin: 0;
      font-size: 2rem;
    }

    .order-footer {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 2px solid #eee;
    }

    .order-date {
      color: #666;
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      background: #2C1810;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn:hover {
      transform: scale(1.05);
      background: #1a0f0a;
    }

    .error {
      text-align: center;
      color: white;
      padding: 3rem;
    }

    .error h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  `]
})
export class OrderViewComponent implements OnInit {
    orderData: any = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const data = params['data'];
            if (data) {
                try {
                    this.orderData = JSON.parse(atob(data));
                } catch (error) {
                    console.error('Error parsing order data:', error);
                }
            }
        });
    }

    downloadPDF() {
        if (this.orderData) {
            // Convert the order data to a format compatible with generatePDF
            const order = {
                ...this.orderData,
                id: 0, // temporary id
                status: 'pending'
            };
            this.orderService.generatePDF(order as any);
        }
    }
}
