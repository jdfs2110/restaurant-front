import { RolService } from '@/app/services/rol.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule
  ],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  protected roles: Rol[] = [];

  constructor(
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.rolService.findAll().subscribe({
      next: (response: Response<Rol[]>) => {
        const { data } = response;
        this.roles = data;
      }
    })
  }
}
