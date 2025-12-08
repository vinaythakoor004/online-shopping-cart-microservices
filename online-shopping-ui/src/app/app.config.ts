import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { provideTranslateService, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AutoRefreshTokenService, createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition, includeBearerTokenInterceptor, provideKeycloak, UserActivityService, withAutoRefreshToken } from 'keycloak-angular';

const keycloakExcludedUrls = [
  {
    url: 'http://localhost:8080',
    matcher: (url: string) => url.includes('keycloak')
  }
];

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^\/api\//i,
  bearerPrefix: 'Bearer'
});

export function HttpLoaderFactory(http: HttpClient, platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
  } else {
    return new TranslateFakeLoader(); // Prevents real HTTP call during SSR
  }
}

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
        url: 'http://localhost:8080',
        realm: 'Springboot-microservices-realm',
        clientId: 'Spring-cloud-client'
    },
    initOptions: {
      redirectUri: window.location.origin,
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000
      })
    ],
    providers: [AutoRefreshTokenService, UserActivityService]
  });

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    // provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideKeycloakAngular(),
    provideHttpClient(withFetch(),
    withInterceptorsFromDi(),
    withInterceptors([includeBearerTokenInterceptor])
  ),
  {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: keycloakExcludedUrls
    },
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [urlCondition]
    },
    provideTranslateService({
       defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, PLATFORM_ID],
      },
    })
  ]
};
