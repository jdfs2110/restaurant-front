import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { UserSignalService } from '@/app/services/user.signal.service';

@Component({
  selector: 'app-rrhh-dashboard',
  standalone: true,
  templateUrl: './rrhh-dashboard.component.html',
  styleUrl: './rrhh-dashboard.component.css',
  imports: [HeaderComponent, RouterOutlet],
})
export class RrhhDashboardComponent implements OnInit {
  private userSignal: UserSignalService = inject(UserSignalService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    if (
      this.userSignal.user().id_rol !== 3 &&
      this.userSignal.user().id_rol !== 4
    ) {
      this.router.navigate(['/']);
    }
  }
}
