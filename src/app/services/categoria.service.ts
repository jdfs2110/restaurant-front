import { Injectable } from "@angular/core";
import { API_URL } from '@/app/constants/url'
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Categoria } from "@/app/types/Categoria";
import { Producto } from "@/app/types/Producto";
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = `${API_URL}/categorias`;
  private token: string = ''; // implement this later

  constructor(private http: HttpClient) { }
  // TODO: implement Authorization headers.

  findAll(page: number = 1): Observable<Response<Categoria[]>> {
    return this.http.get<Response<Categoria[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o Categoría 
    return this.http.get<number>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<Categoria>> {
    return this.http.get<Response<Categoria>>(`${this.url}/${id}`);
  }

  create(categoria: FormData): Observable<Response<Categoria>> {
    return this.http.post<Response<Categoria>>(`${this.url}/new`, categoria);
  }

  update(categoria: FormData, id: number): Observable<Response<Categoria>> {
    return this.http.post<Response<Categoria>>(`${this.url}/${id}?_method=PUT`, categoria);
  }

  delete(id: number): Observable<Response<Categoria>> {
    return this.http.delete<Response<Categoria>>(`${this.url}/${id}`);
  }

  findAllProductsByCategoryId(id: number): Observable<Response<Producto[]>> { // El naming me esta asustando
    return this.http.get<Response<Producto[]>>(`${this.url}/${id}/productos`);
  }
}