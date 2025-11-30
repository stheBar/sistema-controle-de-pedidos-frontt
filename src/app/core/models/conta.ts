export type ContaStatus = 'ABERTA' | 'PENDENTE' | 'FECHADA';

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX'
}

export interface MesaResumo {
  id: number;
  numero: number;
  disponivel: boolean;
}

export interface Conta {
  idConta: number;

  contaStatus: ContaStatus;

  valorTotal: number;

  dataAbertura: string;
  dataFechamento?: string;

  formaPagamento?: FormaPagamento;

  cpfTitular: string;
  nomeTitular: string;

  mesa: MesaResumo;
}
