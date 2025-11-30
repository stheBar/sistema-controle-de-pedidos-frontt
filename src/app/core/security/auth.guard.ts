// src/app/core/security/auth.guard.ts (ou home.guard.ts)

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const homeGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) {
    return true; // Usuário logado: Acesso liberado (para rotas protegidas)
  }

  // Usuário NÃO logado: Nega o acesso e redireciona para o login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
