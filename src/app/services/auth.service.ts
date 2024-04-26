import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "@/app/types/LoginForm";
import { Observable } from "rxjs";
import { Response } from "@/app/types/Response";
import { User } from "@/app/types/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = API_URL;

  constructor(private http: HttpClient) { }
  // TODO: implement headers

  login(loginForm: LoginForm): Observable<Response<User>> {
    return this.http.post<Response<User>>(`${this.url}/login`, loginForm);
  }
}