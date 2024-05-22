import { Injectable } from '@angular/core';
import env from '@/app/env.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '@/app/types/Rol';
import { User } from '@/app/types/User';
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private url = `${env.API_URL}/roles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Response<Rol[]>> {
    return this.http.get<Response<Rol[]>>(`${this.url}`);
  }

  findById(id: number): Observable<Response<Rol>> {
    return this.http.get<Response<Rol>>(`${this.url}/${id}`);
  }

  create(rol: Rol): Observable<Response<Rol>> {
    return this.http.post<Response<Rol>>(`${this.url}/new`, rol);
  }

  update(rol: Rol, id: number): Observable<Response<Rol>> {
    return this.http.put<Response<Rol>>(`${this.url}/${id}`, rol);
  }

  delete(id: number): Observable<Response<Rol>> {
    return this.http.delete<Response<Rol>>(`${this.url}/${id}`);
  }

  findAllUsersWithRol(id: number): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`${this.url}/${id}/usuarios`);
  }
}
