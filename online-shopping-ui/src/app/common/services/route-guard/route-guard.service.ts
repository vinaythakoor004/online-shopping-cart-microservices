import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
import { finalize, map, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private router: Router, private loaderService: LoaderService, private authService: AuthService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // The guard calls checkAuthStatus; the service internally decides if it needs a BE call or uses cache.
    this.loaderService.show();
    return this.authService.checkAuthStatus().pipe(
      map(response => {
        return true;
        // if (response.isAuthenticated) {
        //   return true;
        // } else {
        //   this.router.navigate(['/login']);
        //   return false;
        // }
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
