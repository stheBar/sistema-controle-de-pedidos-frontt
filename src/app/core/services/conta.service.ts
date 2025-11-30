import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conta, ContaStatus, FormaPagamento } from '../models/conta';

export interface CriarContaRequest {
  mesaId: number;
  cpfTitular: string;
  nomeTitular: string;
}

export interface CriarPedidoItem {
  produtoId: number;
  quantidade: number;
  observacao?: string;
}

export interface CriarPedidoRequest {
  itens: CriarPedidoItem[];
}

export interface ContaResumo {
  idConta: number;
  mesa: {
    id: number;
    numero: number;
    disponivel: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private api = 'http://localhost:8081/sistema-controle-pedidos/conta';

  constructor(private http: HttpClient) {}

  listar(status?: ContaStatus): Observable<Conta[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Conta[]>(this.api, { params });
  }

  mostrar(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.api}/${id}`);
  }

  criar(body: CriarContaRequest): Observable<Conta> {
    return this.http.post<Conta>(this.api, body);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  pedir(id: number): Observable<Conta> {
    return this.http.put<Conta>(`${this.api}/${id}/pedir`, {});
  }

  // ✅ AJUSTE FUNDAMENTAL: usar prefixo correto
  criarPedidoNaConta(contaId: number, body: CriarPedidoRequest): Observable<any> {
    return this.http.post<any>(`${this.api}/${contaId}/pedido`, body);
  }

  pagar(id: number, formaPagamento: FormaPagamento): Observable<Conta> {
    return this.http.put<Conta>(`${this.api}/${id}/pagar`, { formaPagamento });
  }

  buscarContaAbertaDaMesa(idMesa: number): Observable<ContaResumo> {
    return this.http.get<ContaResumo>(`${this.api}/mesa/${idMesa}/aberta`);
  }
}
