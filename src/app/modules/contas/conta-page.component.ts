import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { finalize } from 'rxjs/operators';

import { ContaService } from '../../core/services/conta.service';
import { Conta, ContaStatus } from '../../core/models/conta';

import { ContaCreateDialogComponent } from './conta-create-dialog/conta-create-dialog.component';
import { ContaStatusDialogComponent } from './conta-status-dialog/conta-status-dialog.component';

type FiltroStatus = 'TODOS' | ContaStatus;

@Component({
  selector: 'app-conta-page',
  standalone: true,
  templateUrl: './conta-page.component.html',
  styleUrls: ['./conta-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ]
})
export class ContaPageComponent implements OnInit {

  displayedColumns = [
    'mesa',
    'titular',
    'status',
    'valorTotal',
    'formaPagamento',
    'acoes'
  ];

  contas: Conta[] = [];
  loading = false;

  filtroStatus: FiltroStatus = 'TODOS';

  constructor(
    private contaService: ContaService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  private getContaId(c: Conta): number {
    return c.idConta;
  }

  carregar() {
    this.loading = true;
    this.cd.markForCheck();

    const statusParam =
      this.filtroStatus === 'TODOS' ? undefined : this.filtroStatus;

    this.contaService.listar(statusParam)
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: res => {
          this.contas = res ?? [];
          this.cd.markForCheck();
        },
        error: () => {
          this.snack.open('Erro ao carregar contas', 'Fechar', { duration: 2500 });
        }
      });
  }

  get dataSource(): Conta[] {
    return this.contas;
  }

  onChangeFiltroStatus(status: FiltroStatus) {
    this.filtroStatus = status;
    this.carregar();
  }

  abrirNovaConta() {
    const ref = this.dialog.open(ContaCreateDialogComponent, { width: '400px' });

    ref.afterClosed().subscribe(result => {
      if (result === 'refresh') this.carregar();
    });
  }

  abrirGerenciarStatus(conta: Conta) {
    const ref = this.dialog.open(ContaStatusDialogComponent, {
      width: '420px',
      data: conta
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'refresh') this.carregar();
    });
  }

  excluir(conta: Conta) {
    const id = this.getContaId(conta);
    if (!confirm(`Excluir conta da mesa ${conta.mesa?.numero ?? ''}?`)) return;

    this.contaService.deletar(id)
      .subscribe({
        next: () => {
          this.snack.open('Conta excluída!', 'Fechar', { duration: 2500 });
          this.carregar();
        },
        error: () => {
          this.snack.open('Erro ao excluir conta', 'Fechar', { duration: 2500 });
        }
      });
  }

  statusLabel(status: ContaStatus): string {
    switch (status) {
      case 'ABERTA': return 'Aberta';
      case 'PENDENTE': return 'Pendente';
      case 'FECHADA': return 'Fechada';
    }
  }
}
