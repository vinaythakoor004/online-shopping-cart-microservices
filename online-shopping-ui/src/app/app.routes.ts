import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './common/component/page-not-found/page-not-found.component';
import { RouteGuardService } from './common/services/route-guard/route-guard.service';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
      { path: '**', component: PageNotFoundComponent }
    ],
  },
];
