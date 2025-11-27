import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../models/user.model';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="main-layout">
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo">☕</div>
          @if (!sidebarCollapsed) {
            <h2>CoffeeManager</h2>
          }
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span>
            @if (!sidebarCollapsed) {
              <span>Tableau de Bord</span>
            }
          </a>

          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="icon">☕</span>
            @if (!sidebarCollapsed) {
              <span>Produits</span>
            }
          </a>

          <a routerLink="/orders" routerLinkActive="active" class="nav-item">
            <span class="icon">📋</span>
            @if (!sidebarCollapsed) {
              <span>Commandes</span>
            }
          </a>

          @if (isAdmin) {
            <a routerLink="/employees" routerLinkActive="active" class="nav-item">
              <span class="icon">👥</span>
              @if (!sidebarCollapsed) {
                <span>Employés</span>
              }
            </a>

            <a routerLink="/inventory" routerLinkActive="active" class="nav-item">
              <span class="icon">📦</span>
              @if (!sidebarCollapsed) {
                <span>Stock</span>
              }
            </a>

            <a routerLink="/loyalty" routerLinkActive="active" class="nav-item">
              <span class="icon">🎁</span>
              @if (!sidebarCollapsed) {
                <span>Fidélité</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button class="nav-item" (click)="logout()">
            <span class="icon">🚪</span>
            @if (!sidebarCollapsed) {
              <span>Déconnexion</span>
            }
          </button>
        </div>
      </aside>

      <div class="main-content">
        <header class="top-bar">
          <button class="toggle-btn" (click)="toggleSidebar()">
            ☰
          </button>

          @if (currentUser) {
            <div class="user-info">
              <span class="user-name">{{currentUser.firstName}} {{currentUser.lastName}}</span>
              <span class="user-role badge" [class.badge-success]="currentUser.role === 'admin'" [class.badge-info]="currentUser.role === 'employee'">
                {{currentUser.role === 'admin' ? 'Administrateur' : 'Employé'}}
              </span>
            </div>
          }
        </header>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .main-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background-color: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      height: 100vh;
      z-index: 1000;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }

    .logo {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .sidebar-header h2 {
      color: var(--coffee-gold);
      font-size: 1.5rem;
      margin: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 1rem;
    }

    .nav-item:hover {
      background-color: var(--bg-tertiary);
      color: var(--coffee-gold);
    }

    .nav-item.active {
      background-color: var(--coffee-brown);
      color: var(--coffee-gold);
      border-left: 4px solid var(--coffee-gold);
    }

    .nav-item .icon {
      font-size: 1.5rem;
      min-width: 24px;
    }

    .sidebar-footer {
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed + .main-content {
      margin-left: 80px;
    }

    .top-bar {
      height: 70px;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 999;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .toggle-btn:hover {
      background-color: var(--bg-tertiary);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      color: var(--text-primary);
      font-weight: 500;
    }

    .content {
      flex: 1;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .sidebar-nav span:not(.icon) {
        display: none;
      }

      .sidebar-header h2 {
        display: none;
      }

      .main-content {
        margin-left: 80px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
    sidebarCollapsed = false;
    currentUser: User | null = null;
    isAdmin = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.isAdmin = user?.role === UserRole.ADMIN;
        });
    }

    toggleSidebar(): void {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
