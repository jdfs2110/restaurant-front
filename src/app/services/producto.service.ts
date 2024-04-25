import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto, stockQuantity } from "@/app/types/Producto";
import { Stock } from "@/app/types/Stock";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = `${API_URL}/productos`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o Producto 
    return this.http.get<number>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  create(producto: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}/new`, producto);
  }

  update(producto: FormData, id: number): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}/${id}?_method=PUT`, producto);
  }

  delete(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}/${id}`);
  }

  getStock(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.url}/${id}/stock`);
  }

  // any territory (terrorista)

  addStock(quantity: stockQuantity, id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/${id}/stock/add`, quantity);
  }

  reduceStock(quantity: stockQuantity, id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/${id}/stock/reduce`, quantity);
  }
}