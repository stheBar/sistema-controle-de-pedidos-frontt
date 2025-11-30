export interface CriarPedidoItem {
  produtoId: number;
  quantidade: number;
  observacao?: string;
}

export interface CriarPedidoRequest {
  itens: CriarPedidoItem[];
}
