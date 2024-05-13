import { UserSignalService } from "@/app/services/user.signal.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private userSignal: UserSignalService,
    private router: Router
  ) { }

  checkIfAdmin(): void {
    if (this.userSignal.user().id_rol !== 4) {
      this.router.navigateByUrl('/');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 100);
    }
  }
}