import { Injectable } from "@angular/core";
import { API_URL } from "@/app/constants/url";
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "@/app/types/LoginForm";
import { Observable } from "rxjs";
import { LoggedUserResponse } from "@/app/types/LoggedUserResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = API_URL;

  constructor(private http: HttpClient) { }
  // TODO: implement headers

  login(loginForm: LoginForm): Observable<LoggedUserResponse> {
    return this.http.post<LoggedUserResponse>(`${this.url}/login`, loginForm);
  }
}