import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Stock } from "@/app/types/Stock";
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private url: string = `${API_URL}/stock`
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Response<Stock[]>> {
    return this.http.get<Response<Stock[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  create(stock: Stock): Observable<Response<Stock>> { // Al crear un producto se utiliza 'cantidad' pero por si acaso dejo el endpoint
    return this.http.post<Response<Stock>>(`${this.url}/new`, stock);
  }

  update(stock: Stock, id: number): Observable<Response<Stock>> {
    return this.http.put<Response<Stock>>(`${this.url}/${id}`, stock);
  }
}