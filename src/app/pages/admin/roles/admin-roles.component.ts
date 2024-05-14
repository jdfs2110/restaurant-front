import { RolService } from '@/app/services/rol.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@/app/lib/toast.service';
import { ToolbarModule } from 'primeng/toolbar';
@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    RouterLink,
    ConfirmDialogModule,
    ToolbarModule
  ],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  protected roles: Rol[] = [];

  constructor(
    private rolService: RolService,
    private dialogService: ConfirmationService,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {
    this.rolService.findAll().subscribe({
      next: (response: Response<Rol[]>) => {
        const { data } = response;
        this.roles = data;
      }
    })
  }

  showDialog(event: Event, id: number): void {
    this.dialogService.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar el rol?`,
      header: 'Eliminación de rol',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { this.eliminarRol(id) }
    })
  }

  eliminarRol(id: number) {
    this.rolService.delete(id).subscribe({
      next: (response: Response<any>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
        this.findAndDelete(id);
      },
      error: (error: any) => {
        this.toaster.detailedToast('error', 'Error al eliminar el rol', error.error.error)
      }
    })
  }

  findAndDelete(id: number) {
    this.roles.find((rol: Rol, index: number) => {
      if (rol.id === id) {
        this.roles.splice(index, 1);

        return true;
      }

      return false;
    });
  }
}
