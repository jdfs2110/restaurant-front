import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { UserSignalService } from '@/app/services/user.signal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rrhh-dashboard',
  standalone: true,
  templateUrl: './rrhh-dashboard.component.html',
  styleUrl: './rrhh-dashboard.component.css',
  imports: [HeaderComponent, RouterOutlet],
})
export class RrhhDashboardComponent implements OnInit {
  private _userSignal: UserSignalService = inject(UserSignalService);
  private _router: Router = inject(Router);
  private _location: Location = inject(Location);

  ngOnInit(): void {
    if (
      this._userSignal.user().id_rol !== 3 &&
      this._userSignal.user().id_rol !== 4
    ) {
      this._router.navigate(['/']);
    }

    if (this._location.path() === '/' || this._location.path() === '/rrhh') {
      this._router.navigate(['/rrhh/usuarios']);
    }
  }
}
