import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Garante que não sobrescrevemos outros providers
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Adiciona o LOCALE_ID como 'pt-BR'
  ],
}).catch((err) => console.error(err));
