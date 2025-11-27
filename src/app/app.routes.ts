import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent)
            },
            {
                path: 'employees',
                loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
                data: { roles: [UserRole.ADMIN] }
            },
            {
                path: 'inventory',
                loadComponent: () => import('./features/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
                data: { roles: [UserRole.ADMIN] }
            },
            {
                path: 'loyalty',
                loadComponent: () => import('./features/loyalty/loyalty-list/loyalty-list.component').then(m => m.LoyaltyListComponent),
                data: { roles: [UserRole.ADMIN] }
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'client',
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
