import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '@/app/types/Stock';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private url: string = `${env.API_URL}/stock`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 1): Observable<Response<Stock[]>> {
    return this.http.get<Response<Stock[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  create(stock: Stock): Observable<Response<Stock>> {
    // Al crear un producto se utiliza 'cantidad' pero por si acaso dejo el endpoint
    return this.http.post<Response<Stock>>(`${this.url}/new`, stock);
  }

  update(stock: Stock, id: number): Observable<Response<Stock>> {
    return this.http.put<Response<Stock>>(`${this.url}/${id}`, stock);
  }
}
