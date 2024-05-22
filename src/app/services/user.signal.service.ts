import { Injectable, effect, signal } from '@angular/core';
import { User } from '@/app/types/User';

@Injectable({
  providedIn: 'root',
})
export class UserSignalService {
  private userSignal = signal({} as User);
  readonly user = this.userSignal.asReadonly();

  constructor() {}

  updateUser(user: User): void {
    this.userSignal.set(user);
  }

  clearUser(): void {
    this.userSignal.set({} as User);
  }
}
