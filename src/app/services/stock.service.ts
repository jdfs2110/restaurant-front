import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Stock } from "@/app/types/Stock";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private url: string = `${API_URL}/stock`
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o Stock 
    return this.http.get<number>(`${this.url}/pages`);
  }

  create(stock: Stock): Observable<Stock> { // Al crear un producto se utiliza 'cantidad' pero por si acaso dejo el endpoint
    return this.http.post<Stock>(`${this.url}/new`, stock);
  }

  update(stock: Stock, id: number): Observable<Stock> {
    return this.http.put<Stock>(`${this.url}/${id}`, stock);
  }
}