import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { UserSignalService } from '../services/user.signal.service';
import { LoggedUserResponse } from '../types/LoggedUserResponse';

@Injectable({
  providedIn: 'root',
})
export class InitializeService {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private userSignal: UserSignalService,
  ) {}

  public start(redirectTo: string): void {
    if (this.cookieService.get('token') === '') {
      this.router.navigate(['login']);
    } else {
      this.authService.setToken(this.cookieService.get('token'));

      this.authService.validateToken().subscribe({
        next: (response: LoggedUserResponse) => {
          const { data } = response;
          this.userSignal.updateUser(data);

          if (redirectTo !== '') this.router.navigate([redirectTo]);
        },

        error: (error: any) => {
          this.cookieService.deleteAll();
          this.router.navigate(['login']);
        },
      });
    }
  }
}
