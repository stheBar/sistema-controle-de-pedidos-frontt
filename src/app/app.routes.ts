// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { homeGuard } from './core/security/auth.guard';
import { MenuPrincipalComponent } from './modules/sharedComponents/menu-principal/menu-principal';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: '',
    canActivate: [homeGuard],
    component: MenuPrincipalComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./modules/pedidos/pedidos.routes').then(m => m.PEDIDOS_ROUTES)
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./modules/produtos/produtos.routes').then(m => m.PRODUTOS_ROUTES)
      },
      {
        path: 'mesas',
        loadChildren: () =>
          import('./modules/mesa/mesa.routes').then(m => m.MESA_ROUTES)
      },

      {
        path: 'contas',
        loadChildren: () =>
          import('./modules/contas/contas.routes').then(m => m.CONTAS_ROUTES)
      },

      {
        path: 'cozinha',
        loadComponent: () =>
          import('./modules/cozinha/cozinha-pedidos-page.component')
            .then(m => m.CozinhaPedidosPageComponent)
      },



      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
