import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { Mesa } from '../../../core/models/mesa';
import { Conta } from '../../../core/models/conta';
import { ContaService, CriarPedidoRequest } from '../../../core/services/conta.service';
import { Produto } from '../../../core/models/produto';
import { ProdutoService } from '../../../core/services/produto.service';

@Component({
  selector: 'app-pedido-create-dialog',
  standalone: true,
  templateUrl: './pedido-create-dialog.component.html',
  styleUrls: ['./pedido-create-dialog.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule
  ]
})
export class PedidoCreateDialogComponent implements OnInit {

  mesa!: Mesa;
  conta!: Conta;

  form: FormGroup;
  produtos: Produto[] = [];
  itens: any[] = [];

  salvando = false;
  loadingProdutos = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { mesa: Mesa; conta: Conta },
    private ref: MatDialogRef<PedidoCreateDialogComponent>,
    private fb: FormBuilder,
    private contaService: ContaService,
    private produtoService: ProdutoService,
    private snack: MatSnackBar
  ) {
    this.mesa = data.mesa;
    this.conta = data.conta;

    this.form = this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      observacao: ['']
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loadingProdutos = true;
    this.produtoService.listar().subscribe({
      next: p => {
        this.produtos = p;
        this.loadingProdutos = false;
      },
      error: () => {
        this.loadingProdutos = false;
        this.snack.open('Erro ao carregar produtos.', 'Fechar', { duration: 2500 });
      }
    });
  }

  get total(): number {
    return this.itens.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0
    );
  }

  adicionarItem() {
    const { produtoId, quantidade, observacao } = this.form.value;

    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) return;

    this.itens.push({
      produto,
      quantidade,
      observacao
    });

    this.form.reset({ quantidade: 1, observacao: '' });
  }

  removerItem(i: number) {
    this.itens.splice(i, 1);
  }

  salvarPedido() {
    if (this.itens.length === 0) return;

    const body: CriarPedidoRequest = {
      itens: this.itens.map(i => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade,
        observacao: i.observacao
      }))
    };

    this.salvando = true;

    this.contaService.criarPedidoNaConta(this.conta.idConta, body).subscribe({
      next: () => {
        this.salvando = false;
        this.snack.open('Pedido criado com sucesso!', 'Fechar', { duration: 2500 });
        this.ref.close('refresh');
      },
      error: err => {
        this.salvando = false;
        this.snack.open(err?.error?.message || 'Erro ao criar pedido', 'Fechar', { duration: 3000 });
      }
    });
  }

  fechar() {
    this.ref.close();
  }
}
