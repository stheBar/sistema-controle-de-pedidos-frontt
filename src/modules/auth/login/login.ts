import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  logar() {
    if (this.form.invalid) return;

    const { email, senha } = this.form.value;

    this.auth.login(email!, senha!).subscribe({
      next: (resp: any) => {
        this.auth.setToken(resp.token);
        this.router.navigate(['/home']);
      },
      error: (err: any) => alert('Login inválido!')
    });
  }
}
