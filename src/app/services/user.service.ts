import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@/app/types/User";
import { RegisterForm } from "@/app/types/RegisterForm";
import { Pedido } from "@/app/types/Pedido";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${API_URL}/usuarios`;
  private registerURL = `${API_URL}/registro`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<number> { // No estoy seguro de si debería de ser number o User 
    return this.http.get<number>(`${this.url}/pages`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(registerForm: RegisterForm): Observable<User> {
    return this.http.post<User>(`${this.registerURL}`, registerForm);
  }

  update(user: User, id: number): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.url}/${id}`);
  }

  findPedidosManagedByUser(id: number): Observable<Pedido[]> { // Voy a tener que cambiarle de nombre a esta función, es horrible xdd
    return this.http.get<Pedido[]>(`${this.url}/${id}/pedidos`);
  }
}