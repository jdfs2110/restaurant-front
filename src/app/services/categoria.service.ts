import { Injectable } from "@angular/core";
import { API_URL } from '@/app/constants/url'
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Categoria } from "@/app/types/Categoria";
import { Producto } from "@/app/types/Producto";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = `${API_URL}/categorias`;
  private token: string = ''; // implement this later

  constructor(private http: HttpClient) { }
  // TODO: implement Authorization headers.

  findAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  findById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  create(categoria: FormData): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.url}/new`, categoria);
  }

  update(categoria: FormData, id: number): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.url}/${id}?_method=PUT`, categoria);
  }

  delete(id: number): Observable<Categoria> {
    return this.http.delete<Categoria>(`${this.url}/${id}`);
  }

  findAllProductsByCategoryId(id: number): Observable<Producto[]> { // El naming me esta asustando
    return this.http.get<Producto[]>(`${this.url}/${id}/productos`);
  }
}