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
import { forkJoin, of } from 'rxjs';

import { Pedido, PedidoStatus } from '../../core/models/pedido';
import { Conta, ContaStatus } from '../../core/models/conta';
import { PedidoService } from '../../core/services/pedido.service';
import { ContaService } from '../../core/services/conta.service';
import { PedidoStatusDialogComponent} from './pedido-status-dialog/pedido-status-dialog.component';

type FiltroStatus = PedidoStatus | 'TODOS';

interface PedidoCozinhaView {
  pedido: Pedido;
  conta: Conta;
}

@Component({
  selector: 'app-cozinha-pedidos-page',
  standalone: true,
  templateUrl: './cozinha-pedidos-page.component.html',
  styleUrls: ['./cozinha-pedidos-page.component.css'],
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
export class CozinhaPedidosPageComponent implements OnInit {

  loading = false;

  /** pedidos + conta (para saber mesa/titular) */
  pedidos: PedidoCozinhaView[] = [];

  filtroStatus: FiltroStatus = 'PENDENTE';

  readonly statusOptions: FiltroStatus[] = [
    'TODOS',
    'PENDENTE',
    'EM_PREPARO',
    'FINALIZADO',
    'CANCELADO'
  ];

  constructor(
    private pedidoService: PedidoService,
    private contaService: ContaService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.loading = true;
    this.cd.markForCheck();

    this.contaService
      .listar('ABERTA' as ContaStatus)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe({
        next: contas => {
          const contasAbertas = contas ?? [];

          if (contasAbertas.length === 0) {
            this.pedidos = [];
            this.cd.markForCheck();
            return;
          }

          const observables = contasAbertas.map(c =>
            this.pedidoService.listarPorConta(c.idConta!)
          );

          forkJoin(observables).subscribe({
            next: resultados => {
              const views: PedidoCozinhaView[] = [];

              contasAbertas.forEach((conta, idx) => {
                const pedidosConta = resultados[idx] ?? [];
                pedidosConta.forEach(p => {
                  views.push({ pedido: p, conta });
                });
              });

              this.pedidos = views;
              this.cd.markForCheck();
            },
            error: () => {
              this.snack.open('Erro ao carregar pedidos das contas.', 'Fechar', {
                duration: 2500
              });
            }
          });
        },
        error: () => {
          this.snack.open('Erro ao carregar contas abertas.', 'Fechar', {
            duration: 2500
          });
        }
      });
  }

  get pedidosFiltrados(): PedidoCozinhaView[] {
    if (this.filtroStatus === 'TODOS') return this.pedidos;

    return this.pedidos.filter(
      pv => pv.pedido.pedidoStatus === this.filtroStatus
    );
  }

  labelStatus(status?: PedidoStatus): string {
    switch (status) {
      case 'PENDENTE':   return 'Pendente';
      case 'EM_PREPARO': return 'Em preparo';
      case 'FINALIZADO': return 'Finalizado';
      case 'CANCELADO':  return 'Cancelado';
      default:           return '—';
    }
  }

  labelFiltro(s: FiltroStatus): string {
    if (s === 'TODOS') return 'Todos';
    return this.labelStatus(s as PedidoStatus);
  }

  abrirDialogStatus(view: PedidoCozinhaView): void {
    this.dialog
      .open(PedidoStatusDialogComponent, {
        width: '520px',
        maxWidth: '90vw',
        data: { pedido: view.pedido }
      })
      .afterClosed()
      .subscribe(result => {
        if (result === 'refresh') {
          this.carregarPedidos();
        }
      });
  }
}
