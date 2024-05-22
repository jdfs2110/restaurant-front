import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '@/app/types/Mesa';
import { Pedido } from '@/app/types/Pedido';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private url: string = `${env.API_URL}/mesas`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Response<Mesa[]>> {
    return this.http.get<Response<Mesa[]>>(`${this.url}`);
  }

  findById(id: number): Observable<Response<Mesa>> {
    return this.http.get<Response<Mesa>>(`${this.url}/${id}`);
  }

  create(mesa: Mesa): Observable<Response<Mesa>> {
    return this.http.post<Response<Mesa>>(`${this.url}/new`, mesa);
  }

  update(mesa: Mesa, id: number): Observable<Response<Mesa>> {
    return this.http.put<Response<Mesa>>(`${this.url}/${id}`, mesa);
  }

  delete(id: number): Observable<Response<Mesa>> {
    return this.http.delete<Response<Mesa>>(`${this.url}/${id}`);
  }

  findPedidosByIdMesa(id: number): Observable<Response<Pedido[]>> {
    // Dios mio el naming :help:
    return this.http.get<Response<Pedido[]>>(`${this.url}/${id}/pedidos`);
  }

  findLastPedido(id: number): Observable<Response<Pedido>> {
    return this.http.get<Response<Pedido>>(`${this.url}/${id}/pedido`);
  }
}
