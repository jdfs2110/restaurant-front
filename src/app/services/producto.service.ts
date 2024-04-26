import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto, stockQuantity } from "@/app/types/Producto";
import { Stock } from "@/app/types/Stock";
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = `${API_URL}/productos`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Response<Producto[]>> {
    return this.http.get<Response<Producto[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<Producto>> {
    return this.http.get<Response<Producto>>(`${this.url}/${id}`);
  }

  create(producto: FormData): Observable<Response<Producto>> {
    return this.http.post<Response<Producto>>(`${this.url}/new`, producto);
  }

  update(producto: FormData, id: number): Observable<Response<Producto>> {
    return this.http.post<Response<Producto>>(`${this.url}/${id}?_method=PUT`, producto);
  }

  delete(id: number): Observable<Response<Producto>> {
    return this.http.delete<Response<Producto>>(`${this.url}/${id}`);
  }

  getStock(id: number): Observable<Response<Stock>> {
    return this.http.get<Response<Stock>>(`${this.url}/${id}/stock`);
  }

  // any territory (terrorista)

  addStock(quantity: stockQuantity, id: number): Observable<Response<Stock>> {
    return this.http.post<Response<Stock>>(`${this.url}/${id}/stock/add`, quantity);
  }

  reduceStock(quantity: stockQuantity, id: number): Observable<Response<Stock>> {
    return this.http.post<Response<Stock>>(`${this.url}/${id}/stock/reduce`, quantity);
  }
}