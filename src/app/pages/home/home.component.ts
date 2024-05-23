import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@/app/components/header/header.component';
import { Router } from '@angular/router';
import { UserSignalService } from '@/app/services/user.signal.service';
import { MesasComponent } from '../mesas/mesas.component';
import { AdminDashboardComponent } from '../admin/dashboard/admin-dashboard.component';
import { LineasComponent } from '../../components/lineas/lineas.component';
import { RrhhDashboardComponent } from '../rrhh/dashboard/rrhh-dashboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    HeaderComponent,
    MesasComponent,
    AdminDashboardComponent,
    LineasComponent,
    RrhhDashboardComponent,
  ],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private userSignal: UserSignalService,
  ) {}

  protected get idRol(): number {
    return this.userSignal.user().id_rol;
  }

  ngOnInit(): void {
    if (this.idRol === 4) {
      this.router.navigate(['/admin']);
    }
  }
}
