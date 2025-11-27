import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="client-layout">
      <header class="client-header">
        <div class="logo">☕ CoffeeManager</div>
        <nav>
          <a routerLink="/client/menu" routerLinkActive="active">Menu</a>
          <a routerLink="/client/cart" routerLinkActive="active">Panier</a>
        </nav>
      </header>

      <main class="client-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="client-footer">
        <p>&copy; 2025 CoffeeManager. Commandez et dégustez !</p>
      </footer>
    </div>
  `,
    styles: [`
    .client-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-primary);
    }

    .client-header {
      background-color: var(--bg-secondary);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--coffee-gold);
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    nav a:hover, nav a.active {
      color: var(--coffee-gold);
    }

    .client-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .client-footer {
      text-align: center;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      color: var(--text-muted);
    }
  `]
})
export class ClientLayoutComponent { }
