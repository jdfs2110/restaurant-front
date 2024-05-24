import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '@/app/types/Pedido';
import { Linea } from '@/app/types/Linea';
import { Factura } from '@/app/types/Factura';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private url: string = `${env.API_URL}/pedidos`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 1): Observable<Response<Pedido[]>> {
    return this.http.get<Response<Pedido[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<Pedido>> {
    return this.http.get<Response<Pedido>>(`${this.url}/${id}`);
  }

  create(pedido: Pedido): Observable<Response<Pedido>> {
    return this.http.post<Response<Pedido>>(`${this.url}/new`, pedido);
  }

  update(pedido: Pedido, id: number): Observable<Response<Pedido>> {
    return this.http.put<Response<Pedido>>(`${this.url}/${id}`, pedido);
  }

  delete(id: number): Observable<Response<Pedido>> {
    return this.http.delete<Response<Pedido>>(`${this.url}/${id}`);
  }

  getLineas(id: number): Observable<Response<Linea[]>> {
    return this.http.get<Response<Linea[]>>(`${this.url}/${id}/lineas`);
  }

  getFactura(id: number): Observable<Response<Factura>> {
    return this.http.get<Response<Factura>>(`${this.url}/${id}/factura`);
  }

  servirPedido(id: number): Observable<Response<any>> {
    return this.http.post<Response<any>>(`${this.url}/${id}/servir`, null);
  }

  cancelarPedido(id: number): Observable<Response<any>> {
    return this.http.post<Response<any>>(`${this.url}/${id}/cancelar`, null);
  }
}
