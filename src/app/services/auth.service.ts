import { Injectable } from "@angular/core";
import env from '@/app/env.json'
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "@/app/types/LoginForm";
import { Observable } from "rxjs";
import { LoggedUserResponse } from "@/app/types/LoggedUserResponse";
import { CookieService } from "ngx-cookie-service";
import { Response } from "../types/Response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = env.API_URL;
  private token: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(loginForm: LoginForm): Observable<LoggedUserResponse> {
    return this.http.post<LoggedUserResponse>(`${this.url}/login`, loginForm);
  }

  setToken(token: string): void {
    this.token = token;
    this.cookieService.set('token', token, {
      path: '/',
      sameSite: 'Strict'
    });
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  purgeToken(): void {
    this.token = '';
    this.cookieService.deleteAll();
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.url}/logout`, null);
  }

  validateToken(): Observable<LoggedUserResponse> {
    return this.http.post<LoggedUserResponse>(`${this.url}/validateToken`, null);
  }
}