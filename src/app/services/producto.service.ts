import { Injectable } from "@angular/core";
import env from "@/app/env.json";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto, stockQuantity } from "@/app/types/Producto";
import { Stock } from "@/app/types/Stock";
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = `${env.API_URL}/productos`;

  constructor(private http: HttpClient) { }

  findAll(page: number = 1): Observable<Response<Producto[]>> {
    return this.http.get<Response<Producto[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  all(): Observable<Response<Producto[]>> {
    return this.http.get<Response<Producto[]>>(`${this.url}/all`);
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

  addStock(quantity: stockQuantity, id: number): Observable<Response<Stock>> {
    return this.http.post<Response<Stock>>(`${this.url}/${id}/stock/add`, quantity);
  }

  reduceStock(quantity: stockQuantity, id: number): Observable<Response<Stock>> {
    return this.http.post<Response<Stock>>(`${this.url}/${id}/stock/reduce`, quantity);
  }

  findProductsWithSimilarName(name: string): Observable<Response<Producto[]>> {
    return this.http.get<Response<Producto[]>>(`${this.url}/similar/${name}`);
  }
}