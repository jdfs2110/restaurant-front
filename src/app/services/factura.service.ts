import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '@/app/types/Factura';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private url: string = `${env.API_URL}/facturas`;

  constructor(private http: HttpClient) {}

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
