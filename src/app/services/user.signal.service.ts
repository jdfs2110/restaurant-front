import { Injectable, effect, signal } from '@angular/core';
import { User } from '@/app/types/User';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserSignalService {
  private userSignal = signal({} as User);
  readonly user = this.userSignal.asReadonly();

  constructor(private cookieService: CookieService) {
    effect(() => {
      if (this.userSignal().id) {
        this.cookieService.set('user', JSON.stringify(this.userSignal()))
      }
    })
  }

  updateUser(user: User): void {
    this.userSignal.set(user);
  }

  clearUser(): void {
    this.userSignal.set({} as User);
  }
}