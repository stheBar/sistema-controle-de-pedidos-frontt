import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoStatus } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private api = 'http://localhost:8081/sistema-controle-pedidos/pedido';

  constructor(private http: HttpClient) {}

  listarPorConta(idConta: number): Observable<Pedido[]> {
    const params = new HttpParams().set('idConta', idConta);
    return this.http.get<Pedido[]>(`${this.api}/listar-por-conta`, { params});
  }

  atualizarStatus(idPedido: number, status: PedidoStatus): Observable<Pedido> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Pedido>(`${this.api}/${idPedido}/status`, {}, { params });
  }
}
