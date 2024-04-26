import { Injectable } from "@angular/core";
import { API_URL } from "../constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from "@/app/types/Rol";
import { User } from "@/app/types/User";
import { Response } from '@/app/types/Response';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = `${API_URL}/roles`;
  private token: string = ''

  constructor(private http: HttpClient) { }
  // TODO: implement headers

  findAll(page: number = 1): Observable<Response<Rol[]>> {
    return this.http.get<Response<Rol[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
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