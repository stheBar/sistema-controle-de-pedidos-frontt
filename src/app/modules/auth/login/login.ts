import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  hide = true;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    lembrar: [false]
  });

  logar() {
    if (this.form.invalid) return;

    this.loading = true;

    const { email, senha, lembrar } = this.form.value;

    this.auth.login(email!, senha!).subscribe({
      next: (resp: any) => {
        this.auth.setToken(resp.token);

        // salvar email se marcar lembrar-me
        if (lembrar) {
          localStorage.setItem('remember_email', email!);
        } else {
          localStorage.removeItem('remember_email');
        }

        this.router.navigate(['/home']);
        this.loading = false;
      },
      error: () => {
        alert('Login inválido!');
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      this.form.controls.email.setValue(savedEmail);
      this.form.controls.lembrar.setValue(true);
    }
  }
}
