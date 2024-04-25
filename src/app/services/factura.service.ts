import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Factura } from "@/app/types/Factura";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private url: string = `${API_URL}/facturas`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o Factura 
    return this.http.get<number>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}/${id}`);
  }

  create(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(`${this.url}/new`, factura);
  }

  update(factura: Factura, id: number): Observable<Factura> {
    return this.http.put<Factura>(`${this.url}/${id}`, factura);
  }

  delete(id: number): Observable<Factura> {
    return this.http.delete<Factura>(`${this.url}/${id}`);
  }
}