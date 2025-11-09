import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { provideHighcharts } from 'highcharts-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHighcharts({
      modules: () => {
        return [
          import('highcharts/esm/modules/treemap'),
          import('highcharts/esm/modules/heatmap'),
          import('highcharts/esm/modules/map'),
          import('highcharts/esm/modules/accessibility'),
        ];
      },
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
};
