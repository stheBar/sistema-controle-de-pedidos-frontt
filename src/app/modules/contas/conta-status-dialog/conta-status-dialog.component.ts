// src/app/modules/conta/conta-status-dialog/conta-status-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { Conta, ContaStatus, FormaPagamento } from '../../../core/models/conta';
import { ContaService } from '../../../core/services/conta.service';

@Component({
  selector: 'app-conta-status-dialog',
  standalone: true,
  templateUrl: './conta-status-dialog.component.html',
  styleUrls: ['./conta-status-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule
  ]
})
export class ContaStatusDialogComponent {

  conta: Conta;
  pedindo = false;
  pagando = false;

  formaPagamento?: FormaPagamento;

  // 🔧 Ajusta essa lista conforme seu enum FormaPagamento no backend
  formasPagamento: FormaPagamento[] = [
    'DINHEIRO',
    'DEBITO',
    'CREDITO',
    'PIX'
  ] as FormaPagamento[];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Conta,
    private ref: MatDialogRef<ContaStatusDialogComponent>,
    private contaService: ContaService,
    private snack: MatSnackBar
  ) {
    // clona para não mexer direto no objeto da tabela
    this.conta = { ...data };
    this.formaPagamento = this.conta.formaPagamento ?? this.formasPagamento[0];
  }

  private getContaId(): number {
    return (this.conta.idConta ?? this.conta.idConta)!;
  }

  statusLabel(status: ContaStatus): string {
    switch (status) {
      case 'ABERTA': return 'Aberta';
      case 'PENDENTE': return 'Pendente';
      case 'FECHADA': return 'Fechada';
    }
  }

  podePedir(): boolean {
    return this.conta.contaStatus === 'ABERTA';
  }

  podePagar(): boolean {
    return this.conta.contaStatus !== 'FECHADA';
  }

  pedirConta() {
    if (!this.podePedir()) return;

    this.pedindo = true;

    this.contaService.pedir(this.getContaId()).subscribe({
      next: contaAtualizada => {
        this.conta = contaAtualizada;
        this.pedindo = false;
        this.snack.open('Conta pedida com sucesso!', 'Fechar', { duration: 2500 });
      },
      error: err => {
        this.pedindo = false;
        const msg = err?.error?.message || 'Erro ao pedir conta';
        this.snack.open(msg, 'Fechar', { duration: 3000 });
      }
    });
  }

  pagarConta() {
    if (!this.formaPagamento || !this.podePagar()) return;

    this.pagando = true;

    this.contaService.pagar(this.getContaId(), this.formaPagamento).subscribe({
      next: contaAtualizada => {
        this.conta = contaAtualizada;
        this.pagando = false;
        this.snack.open('Conta paga com sucesso!', 'Fechar', { duration: 2500 });
        // avisa a página de contas para recarregar
        this.ref.close('refresh');
      },
      error: err => {
        this.pagando = false;
        const msg = err?.error?.message || 'Erro ao pagar conta';
        this.snack.open(msg, 'Fechar', { duration: 3000 });
      }
    });
  }

  fechar() {
    this.ref.close();
  }
}
