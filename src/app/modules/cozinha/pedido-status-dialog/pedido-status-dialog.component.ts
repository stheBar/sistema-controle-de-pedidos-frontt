import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { Pedido, PedidoStatus} from '../../../core/models/pedido';
import { PedidoService} from '../../../core/services/pedido.service';

@Component({
  selector: 'app-pedido-status-dialog',
  standalone: true,
  templateUrl: './pedido-status-dialog.component.html',
  styleUrls: ['./pedido-status-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class PedidoStatusDialogComponent {

  pedido: Pedido;
  selectedStatus: PedidoStatus;
  salvando = false;

  statusOptions: PedidoStatus[] = [
    'PENDENTE',
    'EM_PREPARO',
    'FINALIZADO',
    'CANCELADO'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { pedido: Pedido },
    private dialogRef: MatDialogRef<PedidoStatusDialogComponent>,
    private pedidoService: PedidoService,
    private snack: MatSnackBar
  ) {
    this.pedido = data.pedido;
    this.selectedStatus = (data.pedido.pedidoStatus ?? 'PENDENTE') as PedidoStatus;
  }

  salvar() {
    if (!this.pedido.idPedido || !this.selectedStatus) {
      return;
    }

    this.salvando = true;

    this.pedidoService.atualizarStatus(this.pedido.idPedido, this.selectedStatus)
      .subscribe({
        next: atualizado => {
          this.salvando = false;
          // atualiza o objeto local só pra refletir na UI, se alguém ainda usar
          this.pedido.pedidoStatus = atualizado.pedidoStatus;
          this.snack.open('Status do pedido atualizado.', 'Fechar', { duration: 2000 });
          // avisa a tela da cozinha para recarregar
          this.dialogRef.close('refresh');
        },
        error: err => {
          this.salvando = false;
          const msg = err?.error?.message || 'Erro ao atualizar status do pedido.';
          this.snack.open(msg, 'Fechar', { duration: 3000 });
        }
      });
  }

  fechar() {
    this.dialogRef.close();
  }
}
