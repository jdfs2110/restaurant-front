import { Injectable } from "@angular/core";
import { API_URL } from "../constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from "@/app/types/Rol";
import { User } from "@/app/types/User";

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = `${API_URL}/roles`;
  private token: string = ''

  constructor(private http: HttpClient) { }
  // TODO: implement headers

  findAll(page: number = 1): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o Rol 
    return this.http.get<number>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  create(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.url}/new`, rol);
  }

  update(rol: Rol, id: number): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}/${id}`, rol);
  }

  delete(id: number): Observable<Rol> {
    return this.http.delete<Rol>(`${this.url}/${id}`);
  }

  findAllUsersWithRol(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/${id}/usuarios`);
  }
}