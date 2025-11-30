import { Routes } from '@angular/router';

export const CONTAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./conta-page.component').then(m => m.ContaPageComponent)
  }
];
