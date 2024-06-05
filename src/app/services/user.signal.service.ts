import { EventEmitter, Injectable, effect, signal } from '@angular/core';
import { User } from '@/app/types/User';

@Injectable({
  providedIn: 'root',
})
export class UserSignalService {
  private userSignal = signal({} as User);
  readonly user = this.userSignal.asReadonly();
  public ready = false;
  public APP_READY: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  updateUser(user: User): void {
    this.userSignal.set(user);
    this.APP_READY.emit(true);
    this.ready = true;
  }

  clearUser(): void {
    this.userSignal.set({} as User);
  }
}
