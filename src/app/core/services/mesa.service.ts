import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mesa } from '../models/mesa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private api = 'http://localhost:8081/sistema-controle-pedidos/mesa';

  constructor(private http: HttpClient) {}

  listar(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.api);
  }

  cadastrar(mesa: Mesa): Observable<void> {
    return this.http.post<void>(this.api, mesa);
  }

  atualizar(mesa: Mesa): Observable<void> {
    return this.http.put<void>(this.api, mesa);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}`, {
      body: { id }
    });
  }
}
