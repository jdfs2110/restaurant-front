import { ToastService } from '@/app/lib/toast.service';
import { RolService } from '@/app/services/rol.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { User } from '@/app/types/User';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-users-by-rol',
  standalone: true,
  imports: [ButtonModule, DialogModule, DataViewModule, CommonModule],
  templateUrl: './users-by-rol.component.html',
  styleUrl: './users-by-rol.component.css',
})
export class UsersByRolComponent implements OnInit {
  @Input({ required: true }) rol: Rol;
  protected isVisible: boolean = false;
  protected users: User[] = [];

  protected first: number = 0;
  protected rows: number = 10;

  constructor(
    private rolService: RolService,
    private toaster: ToastService,
  ) {}

  showDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.rolService.findAllUsersWithRol(this.rol.id).subscribe({
      next: (response: Response<User[]>) => {
        if (response === null) return;

        const { data } = response;

        this.users = data;
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.detailedToast(
          'error',
          'Ha ocurrido un error',
          `Ha ocurrido un error intentando obtener los usuarios del rol ${this.rol.nombre}`,
        );
      },
    });
  }
}
