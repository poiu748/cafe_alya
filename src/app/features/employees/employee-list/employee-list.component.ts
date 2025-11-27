import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <h1>👥 Employés</h1>
        <button class="btn btn-primary" (click)="onAddEmployee()">+ Ajouter un employé</button>
      </header>

      @if (employees.length > 0) {
        <div class="grid grid-3">
          @for (employee of employees; track employee.id) {
            <div class="card employee-card">
              <div class="employee-header">
                <div class="employee-avatar">{{employee.firstName.charAt(0)}}{{employee.lastName.charAt(0)}}</div>
                <div>
                  <h3>{{employee.firstName}} {{employee.lastName}}</h3>
                  <p class="role">{{getRoleLabel(employee.role)}}</p>
                </div>
              </div>
              <div class="employee-details">
                <p><strong>Email:</strong> {{employee.email}}</p>
                <p><strong>Téléphone:</strong> {{employee.phone}}</p>
                <p><strong>Date d'embauche:</strong> {{employee.hireDate | date:'dd/MM/yyyy'}}</p>
                <p>
                  <span class="badge" [class.badge-success]="employee.active" [class.badge-danger]="!employee.active">
                    {{employee.active ? 'Actif' : 'Inactif'}}
                  </span>
                </p>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>Aucun employé trouvé</p>
        </div>
      }

      @if (showAddModal) {
        <app-employee-form (close)="onCloseModal()" (save)="onEmployeeSaved()"></app-employee-form>
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

    .employee-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .employee-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .employee-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--coffee-accent), var(--coffee-gold));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--coffee-dark);
    }

    .employee-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .role {
      color: var(--coffee-gold);
      font-size: 0.9rem;
      margin: 0;
    }

    .employee-details p {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  showAddModal = false;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  onAddEmployee(): void {
    this.showAddModal = true;
  }

  onCloseModal(): void {
    this.showAddModal = false;
  }

  onEmployeeSaved(): void {
    this.loadEmployees();
  }

  getRoleLabel(role: string): string {
    const labelMap: { [key: string]: string } = {
      'server': 'Serveur',
      'barista': 'Barista',
      'cashier': 'Caissier',
      'manager': 'Manager'
    };
    return labelMap[role] || role;
  }
}
