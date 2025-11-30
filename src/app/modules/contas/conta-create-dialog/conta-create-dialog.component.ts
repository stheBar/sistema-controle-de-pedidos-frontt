// src/app/modules/conta/conta-create-dialog/conta-create-dialog.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Mesa } from '../../../core/models/mesa';
import { MesaService } from '../../../core/services/mesa.service';
import { ContaService, CriarContaRequest } from '../../../core/services/conta.service';

@Component({
  selector: 'app-conta-create-dialog',
  standalone: true,
  templateUrl: './conta-create-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class ContaCreateDialogComponent implements OnInit {

  form: FormGroup;
  mesas: Mesa[] = [];
  loadingMesas = false;

  constructor(
    private fb: FormBuilder,
    private mesaService: MesaService,
    private contaService: ContaService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<ContaCreateDialogComponent>
  ) {
    this.form = this.fb.group({
      mesaId: [null, Validators.required],
      cpfTitular: ['', [Validators.required]],
      nomeTitular: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarMesas();
  }

  carregarMesas() {
    this.loadingMesas = true;
    this.mesaService.listar().subscribe({
      next: mesas => {
        this.mesas = mesas ?? [];
        this.loadingMesas = false;
      },
      error: () => {
        this.loadingMesas = false;
        this.snack.open('Erro ao carregar mesas', 'Fechar', { duration: 2500 });
      }
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const body: CriarContaRequest = {
      mesaId: this.form.value.mesaId,
      cpfTitular: this.form.value.cpfTitular,
      nomeTitular: this.form.value.nomeTitular
    };

    this.contaService.criar(body).subscribe({
      next: () => {
        this.snack.open('Conta criada com sucesso!', 'Fechar', { duration: 2500 });
        this.ref.close('refresh');
      },
      error: err => {
        const msg = err?.error?.message || 'Erro ao criar conta';
        this.snack.open(msg, 'Fechar', { duration: 3000 });
      }
    });
  }

  fechar() {
    this.ref.close();
  }
}
