import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Mesa } from "@/app/types/Mesa";

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private url: string = `${API_URL}/mesas`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.url}`);
  }

  findById(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.url}/${id}`);
  }

  create(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.url}/new`, mesa);
  }

  update(mesa: Mesa, id: number): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.url}/${id}`, mesa);
  }

  delete(id: number): Observable<Mesa> {
    return this.http.delete<Mesa>(`${this.url}/${id}`);
  }
}