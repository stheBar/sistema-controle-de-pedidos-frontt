// role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. O usuário PRECISA estar logado. Se não estiver, redireciona para o login.
  if (!auth.isLogged()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // 2. Obtém as funções necessárias (requiredRoles) definidas na propriedade 'data' da rota.
  // Se não houver 'roles' na rota, o acesso é permitido por padrão (apenas exige estar logado).
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 3. Verifica a função.
  if (auth.hasRole(requiredRoles)) {
    return true; // Permite o acesso
  }

  // 4. Se logado, mas sem a função correta, nega o acesso (redireciona para /home ou /acesso-negado)
  // Por simplicidade, vamos redirecionar para a rota principal do usuário logado.
  // Você pode criar uma rota 'acesso-negado' se preferir.
  alert('Acesso negado. Sua função (' + auth.getUser()?.role + ') não tem permissão para esta página.');
  return router.createUrlTree(['/home']);
};
