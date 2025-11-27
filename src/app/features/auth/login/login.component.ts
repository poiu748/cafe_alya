import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">☕</div>
          <h1>CoffeeManager</h1>
          <p>Système de gestion de café</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username" class="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              class="form-control"
              [(ngModel)]="credentials.username"
              required
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-control"
              [(ngModel)]="credentials.password"
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          @if (errorMessage) {
            <div class="alert alert-danger">{{ errorMessage }}</div>
          }

          <button type="submit" class="btn btn-primary w-full" [disabled]="!loginForm.valid || loading">
            @if (loading) {
              <span>Connexion...</span>
            } @else {
              <span>Se connecter</span>
            }
          </button>
        </form>

        <div class="login-footer">
          <p class="demo-credentials">
            <strong>Identifiants de démo:</strong><br>
            Admin: admin / admin123<br>
            Employé: employee / emp123
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--coffee-dark) 100%);
    }

    .login-card {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 3rem;
      max-width: 450px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s ease;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .login-header h1 {
      color: var(--coffee-gold);
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .w-full {
      width: 100%;
    }

    .login-footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }

    .demo-credentials {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.8;
    }

    .demo-credentials strong {
      color: var(--coffee-gold);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
