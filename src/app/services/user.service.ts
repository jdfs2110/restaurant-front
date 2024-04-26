import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@/app/types/User";
import { RegisterForm } from "@/app/types/RegisterForm";
import { Pedido } from "@/app/types/Pedido";
import { Response } from "@/app/types/Response";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${API_URL}/usuarios`;
  private registerURL = `${API_URL}/registro`;
  private token: string = '';

  constructor(private http: HttpClient) { }
  // TODO: implement headers / token

  findAll(page: number = 1): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`${this.url}?page=${page}`);
  }

  getPages(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.url}/pages`);
  }

  findById(id: number): Observable<Response<User>> {
    return this.http.get<Response<User>>(`${this.url}/${id}`);
  }

  create(registerForm: RegisterForm): Observable<Response<User>> {
    return this.http.post<Response<User>>(`${this.registerURL}`, registerForm);
  }

  update(user: User, id: number): Observable<Response<User>> {
    return this.http.put<Response<User>>(`${this.url}/${id}`, user);
  }

  delete(id: number): Observable<Response<User>> {
    return this.http.delete<Response<User>>(`${this.url}/${id}`);
  }

  findPedidosManagedByUser(id: number): Observable<Response<Pedido[]>> { // Voy a tener que cambiarle de nombre a esta función, es horrible xdd
    return this.http.get<Response<Pedido[]>>(`${this.url}/${id}/pedidos`);
  }
}