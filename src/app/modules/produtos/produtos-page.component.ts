import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { Produto } from '../../core/models/produto';
import { ProdutoService } from '../../core/services/produto.service';
import { ProdutoDialogComponent } from './produto-dialog.component/produto-dialog.component';

@Component({
  selector: 'app-produtos-page',
  standalone: true,
  templateUrl: './produtos-page.component.html',
  styleUrls: ['./produtos-page.component.css'],
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
  ],
})
export class ProdutosPageComponent implements OnInit {

  displayedColumns = ['nome', 'preco', 'categoria', 'disponivel', 'acoes'];
  produtos: Produto[] = [];
  loading = false;

  constructor(
      private produtoService: ProdutoService,
      private dialog: MatDialog,
      private snack: MatSnackBar,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading = true;
    this.cd.markForCheck();

    this.produtoService
        .listar()
        .pipe(
            finalize(() => {
              this.loading = false;
              this.cd.markForCheck();
            })
        )
        .subscribe({
          next: (res) => {
            this.produtos = res;
            this.cd.markForCheck(); // força atualização da view
          },
          error: () => {
            this.snack.open('Erro ao carregar produtos', 'Fechar', {
              duration: 3000,
            });
          },
        });
  }

  abrirModal(produto?: Produto) {
    const dialogRef = this.dialog.open(ProdutoDialogComponent, {
      width: '420px',
      data: produto ?? null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.carregarProdutos();
      }
    });
  }

  excluir(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"?`)) return;

    this.produtoService.excluir(p.id!).subscribe({
      next: () => {
        this.snack.open('Produto excluído!', 'Fechar', { duration: 2500 });
        this.carregarProdutos();
      },
      error: () => {
        this.snack.open('Erro ao excluir produto', 'Fechar', {
          duration: 2500,
        });
      },
    });
  }
}
