import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, EmployeeRole } from '../../../models/employee.model';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ajouter un employé</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #employeeForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input type="text" id="firstName" name="firstName" [(ngModel)]="employee.firstName" required class="form-control">
            </div>

            <div class="form-group">
              <label for="lastName">Nom</label>
              <input type="text" id="lastName" name="lastName" [(ngModel)]="employee.lastName" required class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" [(ngModel)]="employee.email" required email class="form-control">
          </div>

          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input type="tel" id="phone" name="phone" [(ngModel)]="employee.phone" required class="form-control">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="role">Rôle</label>
              <select id="role" name="role" [(ngModel)]="employee.role" required class="form-control">
                <option [value]="Role.SERVER">Serveur</option>
                <option [value]="Role.BARISTA">Barista</option>
                <option [value]="Role.CASHIER">Caissier</option>
                <option [value]="Role.MANAGER">Manager</option>
              </select>
            </div>

            <div class="form-group">
              <label for="salary">Salaire (€)</label>
              <input type="number" id="salary" name="salary" [(ngModel)]="employee.salary" required min="0" class="form-control">
            </div>
          </div>

          <div class="form-check">
            <input type="checkbox" id="active" name="active" [(ngModel)]="employee.active">
            <label for="active">Actif</label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!employeeForm.valid">Ajouter</button>
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
export class EmployeeFormComponent {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();

    Role = EmployeeRole;
    employee: Partial<Employee> = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: EmployeeRole.SERVER,
        salary: 0,
        active: true,
        hireDate: new Date()
    };

    constructor(private employeeService: EmployeeService) { }

    onSubmit() {
        this.employeeService.createEmployee(this.employee).subscribe(() => {
            this.save.emit();
            this.close.emit();
        });
    }

    onCancel() {
        this.close.emit();
    }
}
