import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layout/client-layout.component';
import { ClientMenuComponent } from './menu/client-menu.component';
import { ClientCartComponent } from './cart/client-cart.component';

export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        component: ClientLayoutComponent,
        children: [
            { path: '', redirectTo: 'menu', pathMatch: 'full' },
            { path: 'menu', component: ClientMenuComponent },
            { path: 'cart', component: ClientCartComponent }
        ]
    }
];
