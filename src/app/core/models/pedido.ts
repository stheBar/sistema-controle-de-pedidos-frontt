export type PedidoStatus =
  | 'PENDENTE'
  | 'EM_PREPARO'
  | 'FINALIZADO'
  | 'CANCELADO';

export interface ProdutoResumo {
  id?: number;
  nome?: string;
  preco?: number;
}

export interface PedidoItem {
  idItem?: number;
  produto?: ProdutoResumo;
  quantidade?: number;
  precoUnitario?: number;
  observacao?: string;
}

export interface Pedido {
  idPedido?: number;
  dataHoraPedido?: string;
  pedidoStatus?: PedidoStatus;
  itens?: PedidoItem[];
}
