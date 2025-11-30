// src/app/modules/pedidos/pedido-page.component.ts

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Mesa } from '../../core/models/mesa';
import { Conta } from '../../core/models/conta';
import { MesaService } from '../../core/services/mesa.service';
import { ContaService } from '../../core/services/conta.service';

import { PedidoListDialogComponent } from './pedido-list-dialog/pedido-list-dialog.component';
import { PedidoCreateDialogComponent } from './pedido-create-dialog/pedido-create-dialog.component';
import { ContaStatusDialogComponent } from '../contas/conta-status-dialog/conta-status-dialog.component';

interface MesaCardView {
  mesa: Mesa;
  conta?: Conta;
}

@Component({
  selector: 'app-pedido-page',
  standalone: true,
  templateUrl: './pedido-page.component.html',
  styleUrls: ['./pedido-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule
  ]
})
export class PedidoPageComponent implements OnInit {

  loading = false;
  cards: MesaCardView[] = [];

  constructor(
    private mesaService: MesaService,
    private contaService: ContaService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.cd.markForCheck();

    forkJoin({
      mesas: this.mesaService.listar(),
      contasAbertas: this.contaService.listar('ABERTA')
    })
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: ({ mesas, contasAbertas }) => {
          const contas = contasAbertas ?? [];

          this.cards = (mesas ?? []).map(m => ({
            mesa: m,
            conta: contas.find(c => c.mesa?.id === m.id)
          }));

          this.cd.markForCheck();
        },
        error: () => {
          this.snack.open('Erro ao carregar mesas/contas.', 'Fechar', { duration: 2500 });
        }
      });
  }

  statusContaLabel(conta?: Conta): string {
    if (!conta) return 'Sem conta aberta';
    switch (conta.contaStatus) {
      case 'ABERTA': return 'Conta aberta';
      case 'PENDENTE': return 'Conta pedida';
      case 'FECHADA': return 'Conta fechada';
      default: return conta.contaStatus;
    }
  }

  cardClass(card: MesaCardView) {
    const status = card.conta?.contaStatus;
    return {
      'card-sem-conta': !card.conta,
      'card-conta-aberta': status === 'ABERTA',
      'card-conta-pendente': status === 'PENDENTE',
      'card-conta-fechada': status === 'FECHADA'
    };
  }
  abrirModalPedidos(card: MesaCardView) {
    this.dialog.open(PedidoListDialogComponent, {
      width: '100%',           // deixa flexível
      maxWidth: '460px',       // largura IDEAL sem scroll horizontal
      height: 'auto',
      maxHeight: '90vh',       // deixa a altura dinâmica
      panelClass: 'pedido-dialog-panel',
      data: { mesa: card.mesa, conta: card.conta }
    });
  }




  abrirModalNovoPedido(card: MesaCardView) {
    if (!card.conta) {
      this.snack.open('Mesa não possui conta aberta.', 'Fechar', { duration: 2500 });
      return;
    }

    this.dialog
      .open(PedidoCreateDialogComponent, {
        width: '600px',
        maxWidth: '95vw',
        height: 'auto',
        maxHeight: '95vh',
        panelClass: 'pedido-dialog-panel',
        data: { mesa: card.mesa, conta: card.conta }
      })
      .afterClosed()
      .subscribe(result => {
        if (result === 'refresh') this.carregar();
      });
  }

  abrirModalStatusConta(card: MesaCardView) {
    if (!card.conta) {
      this.snack.open('Mesa não possui conta aberta.', 'Fechar', { duration: 2500 });
      return;
    }

    this.dialog
      .open(ContaStatusDialogComponent, {
        width: '420px',
        data: card.conta
      })
      .afterClosed()
      .subscribe(result => {
        if (result === 'refresh') this.carregar();
      });
  }
}
