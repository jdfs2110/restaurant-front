import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Linea } from '@/app/types/Linea';
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class LineaService {
  private url: string = `${API_URL}/lineas`
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Response<Linea[]>> {
    return this.http.get<Response<Linea[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<Linea>> {
    return this.http.get<Response<Linea>>(`${this.url}/${id}`);
  }

  create(linea: Linea): Observable<Response<Linea>> {
    return this.http.post<Response<Linea>>(`${this.url}/new`, linea);
  }

  update(linea: Linea, id: number): Observable<Response<Linea>> {
    return this.http.put<Response<Linea>>(`${this.url}/${id}`, linea);
  }

  delete(id: number): Observable<Response<Linea>> {
    return this.http.delete<Response<Linea>>(`${this.url}/${id}`);
  }
}