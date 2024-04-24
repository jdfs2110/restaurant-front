import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pedido } from "@/app/types/Pedido";
import { Linea } from "@/app/types/Linea";
import { Factura } from "@/app/types/Factura";

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private url: string = `${API_URL}/pedidos`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}`);
  }

  findById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}/new`, pedido);
  }

  update(pedido: Pedido, id: number): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}/${id}`, pedido);
  }

  delete(id: number): Observable<Pedido> {
    return this.http.delete<Pedido>(`${this.url}/${id}`);
  }

  getLineas(id: number): Observable<Linea[]> {
    return this.http.get<Linea[]>(`${this.url}/${id}/lineas`);
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}/${id}/factura`);
  }
}