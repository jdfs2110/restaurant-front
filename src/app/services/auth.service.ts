import { Injectable } from "@angular/core";
import env from '@/app/env.json'
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "@/app/types/LoginForm";
import { Observable } from "rxjs";
import { LoggedUserResponse } from "@/app/types/LoggedUserResponse";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = env.API_URL;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(loginForm: LoginForm): Observable<LoggedUserResponse> {
    return this.http.post<LoggedUserResponse>(`${this.url}/login`, loginForm);
  }

  setToken(token: string): void {
    this.cookieService.set('token', token);
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.url}/logout`, null);
  }
}