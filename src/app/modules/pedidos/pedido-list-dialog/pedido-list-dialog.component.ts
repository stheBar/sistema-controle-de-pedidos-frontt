import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { finalize } from 'rxjs/operators';

import { Mesa } from '../../../core/models/mesa';
import { Conta } from '../../../core/models/conta';
import { Pedido, PedidoStatus } from '../../../core/models/pedido';
import { PedidoService } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-pedido-list-dialog',
  standalone: true,
  templateUrl: './pedido-list-dialog.component.html',
  styleUrls: ['./pedido-list-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class PedidoListDialogComponent implements OnInit {

  mesa!: Mesa;
  conta?: Conta;

  loading = false;
  pedidos: Pedido[] = [];

  displayedColumns = ['id', 'data', 'status'];

  statusOptions: PedidoStatus[] = [
    'PENDENTE',
    'EM_PREPARO',
    'FINALIZADO',
    'CANCELADO'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { mesa: Mesa; conta?: Conta },
    private ref: MatDialogRef<PedidoListDialogComponent>,
    private pedidoService: PedidoService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef              // <- IMPORTANTE
  ) {
    this.mesa = data.mesa;
    this.conta = data.conta;
  }

  ngOnInit(): void {
    if (this.conta?.idConta) {
      // evita erro NG0100
      setTimeout(() => this.carregarPedidos());
    }
  }

  carregarPedidos() {
    this.loading = true;
    this.cdr.detectChanges();       // <- EVITA NG0100

    this.pedidoService.listarPorConta(this.conta!.idConta)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();   // <- EVITA NG0100
      }))
      .subscribe({
        next: res => {
          this.pedidos = res ?? [];
          this.cdr.detectChanges(); // <- EVITA NG0100
        },
        error: () => {
          this.snack.open('Erro ao carregar pedidos da conta.', 'Fechar', { duration: 2500 });
          this.cdr.detectChanges();
        }
      });
  }

  statusLabel(p: Pedido): string {
    return p.pedidoStatus ?? '—';
  }

  atualizarStatus(pedido: Pedido, novoStatus: PedidoStatus) {
    if (!pedido.idPedido) return;

    this.pedidoService.atualizarStatus(pedido.idPedido, novoStatus)
      .subscribe({
        next: atualizado => {
          pedido.pedidoStatus = atualizado.pedidoStatus;
          this.cdr.detectChanges();    // <- EVITA NG0100
          this.snack.open('Status do pedido atualizado.', 'Fechar', { duration: 2000 });
        },
        error: err => {
          const msg = err?.error?.message || 'Erro ao atualizar status';
          this.snack.open(msg, 'Fechar', { duration: 3000 });
        }
      });
  }

  fechar() {
    this.ref.close();
  }
}
