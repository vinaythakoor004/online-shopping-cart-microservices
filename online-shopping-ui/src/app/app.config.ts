import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { provideTranslateService, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient, platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
  } else {
    return new TranslateFakeLoader(); // Prevents real HTTP call during SSR
  }
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    // provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
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
