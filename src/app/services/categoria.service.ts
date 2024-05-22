import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '@/app/types/Categoria';
import { Producto } from '@/app/types/Producto';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private url = `${env.API_URL}/categorias`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 1): Observable<Response<Categoria[]>> {
    return this.http.get<Response<Categoria[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  all(): Observable<Response<Categoria[]>> {
    return this.http.get<Response<Categoria[]>>(`${this.url}/all`);
  }

  findById(id: number): Observable<Response<Categoria>> {
    return this.http.get<Response<Categoria>>(`${this.url}/${id}`);
  }

  create(categoria: FormData): Observable<Response<Categoria>> {
    return this.http.post<Response<Categoria>>(`${this.url}/new`, categoria);
  }

  update(categoria: FormData, id: number): Observable<Response<Categoria>> {
    return this.http.post<Response<Categoria>>(
      `${this.url}/${id}?_method=PUT`,
      categoria,
    );
  }

  delete(id: number): Observable<Response<Categoria>> {
    return this.http.delete<Response<Categoria>>(`${this.url}/${id}`);
  }

  findAllProductsByCategoryId(id: number): Observable<Response<Producto[]>> {
    return this.http.get<Response<Producto[]>>(`${this.url}/${id}/productos`);
  }

  findCategoriesWithSimilarName(
    name: string,
  ): Observable<Response<Categoria[]>> {
    return this.http.get<Response<Categoria[]>>(`${this.url}/similar/${name}`);
  }
}
