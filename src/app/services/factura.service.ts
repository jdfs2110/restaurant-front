import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Factura } from "@/app/types/Factura";
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private url: string = `${API_URL}/facturas`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Response<Factura[]>> {
    return this.http.get<Response<Factura[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<Factura>> {
    return this.http.get<Response<Factura>>(`${this.url}/${id}`);
  }

  create(factura: Factura): Observable<Response<Factura>> {
    return this.http.post<Response<Factura>>(`${this.url}/new`, factura);
  }

  update(factura: Factura, id: number): Observable<Response<Factura>> {
    return this.http.put<Response<Factura>>(`${this.url}/${id}`, factura);
  }

  delete(id: number): Observable<Response<Factura>> {
    return this.http.delete<Response<Factura>>(`${this.url}/${id}`);
  }
}