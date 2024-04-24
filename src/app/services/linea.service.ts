import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Linea } from '@/app/types/Linea';

@Injectable({
  providedIn: 'root'
})
export class LineaService {
  private url: string = `${API_URL}/lineas`
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(): Observable<Linea[]> {
    return this.http.get<Linea[]>(`${this.url}`);
  }

  findById(id: number): Observable<Linea> {
    return this.http.get<Linea>(`${this.url}/${id}`);
  }

  create(linea: Linea): Observable<Linea> {
    return this.http.post<Linea>(`${this.url}/new`, linea);
  }

  update(linea: Linea, id: number): Observable<Linea> {
    return this.http.put<Linea>(`${this.url}/${id}`, linea);
  }

  delete(id: number): Observable<Linea> {
    return this.http.delete<Linea>(`${this.url}/${id}`);
  }
}