import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoaderService } from '../loader/loader.service';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

  const { authenticated, grantedRoles } = authData;
  const requiredRoles: string[] = Array.isArray(route.data['role'])
    ? route.data['role']
    : [route.data['role']];

  if (!requiredRoles || requiredRoles.length === 0) return false;

  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.resourceRoles)
      .some((roles) => roles.includes(role));

  const userHasAccess = requiredRoles.some(hasRequiredRole);

  if (authenticated && userHasAccess) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/forbidden');
};

const keycloakAuthGuard = createAuthGuard(isAccessAllowed);

export const loaderKeycloakGuard = ((
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  loaderService.show();
  const guardResult = keycloakAuthGuard(route, state);
  return Promise.resolve(guardResult)
    .then((result) => {
      loaderService.hide();
      return result;
    })
    .catch((error) => {
      console.error('Keycloak Guard failed:', error);
      loaderService.hide();
      return router.parseUrl('/login');
    });
}) as CanActivateFn;
