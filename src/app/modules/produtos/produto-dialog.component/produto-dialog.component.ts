import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { ProdutoService } from '../../../core/services/produto.service';
import { Produto } from '../../../core/models/produto';
import { finalize } from 'rxjs';
import {MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  selector: 'app-produto-dialog',
  standalone: true,
  styleUrls: ['./produto-dialog.component.css'],
  templateUrl: './produto-dialog.component.html'
})
export class ProdutoDialogComponent {

  form: FormGroup;
  categorias = ['COMIDA', 'BEBIDA', 'SOBREMESA', 'OUTROS'];
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProdutoDialogComponent>,
    private produtoService: ProdutoService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: Produto | null
  ) {

    this.form = this.fb.group({
      id: [data?.id ?? null],
      nome: [data?.nome ?? '', Validators.required],
      descricao: [data?.descricao ?? '', Validators.required],
      preco: [data?.preco ?? 0, [Validators.required, Validators.min(0)]],
      disponivel: [data?.disponivel ?? true],
      categoria: [data?.categoria ?? 'COMIDA', Validators.required]
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const produto = this.form.value as Produto;

    const op$ = produto.id
      ? this.produtoService.atualizar(produto)
      : this.produtoService.cadastrar(produto);

    op$
      .pipe(finalize(() => {
        this.salvando = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: () => this.dialogRef.close('refresh'),
        error: () => {
          alert('Erro ao salvar produto');
        }
      });
  }

  fechar() {
    this.dialogRef.close();
  }
}
