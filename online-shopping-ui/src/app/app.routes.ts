import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './common/component/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { loaderKeycloakGuard } from './common/services/route-guard/route-guard.service';
import { AdminComponent } from './admin/admin.component';

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
      { path: 'admin', component: AdminComponent, canActivate: [loaderKeycloakGuard],
        data: {
          role: ['admin']
        }
      },
      { path: '**', component: PageNotFoundComponent }
    ],
  },
];
