import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './common/component/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { loaderKeycloakGuard } from './common/services/route-guard/route-guard.service';
import { AdminComponent } from './admin/admin.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { CartComponent } from './cart/cart.component';
import { MyAccountComponent } from './my-account/my-account.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [loaderKeycloakGuard],
        data: {
          role: ['user', 'admin']
        }
      },
      {
      path: 'product/:productName', canActivate: [loaderKeycloakGuard],
        data: {
          role: ['user', 'admin']
        },
        loadComponent: () =>
          import('./product-description/product-description.component')
            .then(c => c.ProductDescriptionComponent),
      },
      { path: 'admin', component: AdminComponent, canActivate: [loaderKeycloakGuard],
        data: {
          role: ['admin']
        }
      },
      { path: 'cart', component: CartComponent, canActivate: [loaderKeycloakGuard],
        data: {
          role: ['user', 'admin']
        }
      },
      { path: 'my-account', component: MyAccountComponent, canActivate: [loaderKeycloakGuard],
        data: {
          role: ['user', 'admin']
        }
      },
      { path: '**', component: PageNotFoundComponent }
    ],
  },
];
