import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Usuario } from '../models/usuario';
import {ActivatedRoute, Router} from '@angular/router';
import {env} from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  login(email: string, senha: string) {
    return this.httpClient.post<any>(env.apiUrl + "/auth/login", {email, senha});
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.userFromToken(token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUser(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  private userFromToken(token: string): Usuario | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload));
      console.log("Decoded JWT:", decoded);

      // extrai role do token
      let role: string | undefined = decoded.role;

      // converte "ROLE_ADMIN" → "admin"
      if (role?.startsWith("ROLE_")) {
        if (role != null) {
          role = role.replace("ROLE_", "").toLowerCase();
        }
      }

      return {
        id: decoded.uid ?? undefined,
        nome: decoded.nome ?? undefined,
        email: decoded.sub ?? undefined,
        role: role
      };

    } catch (e) {
      return null;
    }
  }


  redirect() {
    this.route.queryParams.subscribe(params => {
      const returnUrl = params['returnUrl'] || '/home';
      this.router.navigateByUrl(returnUrl);
    });
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.getUser();
    if (!user || !user.role) {
      return false; // Não logado ou sem função definida
    }

    // Compara a função do usuário com as funções permitidas
    return requiredRoles.includes(user.role);
  }
}
