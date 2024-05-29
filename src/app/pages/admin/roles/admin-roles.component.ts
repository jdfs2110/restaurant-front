import { RolService } from '@/app/services/rol.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@/app/lib/toast.service';
import { ToolbarModule } from 'primeng/toolbar';
import { RolEditDialogComponent } from '../../../components/admin/roles/rol-edit-dialog/rol-edit-dialog.component';
import { UsersByRolComponent } from '../../../components/admin/roles/users-by-rol/users-by-rol.component';
import { CreateRolComponent } from '../../../components/admin/roles/create-rol/create-rol.component';
@Component({
  selector: 'app-admin-roles',
  standalone: true,
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css',
  imports: [
    TableModule,
    ButtonModule,
    ToolbarModule,
    RolEditDialogComponent,
    UsersByRolComponent,
    CreateRolComponent,
  ],
})
export class AdminRolesComponent implements OnInit {
  protected roles: Rol[] = [];

  constructor(
    private rolService: RolService,
    private dialogService: ConfirmationService,
    private toaster: ToastService,
  ) {}

  ngOnInit(): void {
    this.rolService.findAll().subscribe({
      next: (response: Response<Rol[]>) => {
        const { data } = response;
        this.roles = data;
      },
    });
  }

  showDialog(event: Event, rol: Rol): void {
    this.dialogService.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar el rol?`,
      header: 'Eliminación de rol',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.eliminarRol(rol);
      },
    });
  }

  eliminarRol(rol: Rol) {
    const pos = this.roles.indexOf(rol);
    this.rolService.delete(rol.id).subscribe({
      next: (response: Response<any>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
        this.roles = this.roles.filter((r: Rol) => {
          return r.id !== rol.id;
        });
      },
      error: (error: any) => {
        // this.roles.splice(pos, 0, rol);
        this.toaster.detailedToast(
          'error',
          'Error al eliminar el rol',
          error.error.error,
        );
      },
    });
  }

  updateRol(rol: Rol) {
    this.roles = this.roles.map((r: Rol) => {
      if (r.id === rol.id) {
        return rol;
      }

      return r;
    });
  }

  pushRol(rol: Rol) {
    this.roles = [...this.roles, rol];
  }
}
