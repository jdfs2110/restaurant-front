import { ToastService } from '@/app/lib/toast.service';
import { MesaService } from '@/app/services/mesa.service';
import { Mesa } from '@/app/types/Mesa';
import { Response } from '@/app/types/Response';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { CreateMesaComponent } from '../../../components/admin/mesas/create-mesa/create-mesa.component';
import { MesaEditDialogComponent } from '../../../components/admin/mesas/mesa-edit-dialog/mesa-edit-dialog.component';

@Component({
  selector: 'app-admin-mesas',
  standalone: true,
  templateUrl: './admin-mesas.component.html',
  styleUrl: './admin-mesas.component.css',
  imports: [
    TableModule,
    ButtonModule,
    ToolbarModule,
    CreateMesaComponent,
    MesaEditDialogComponent,
  ],
})
export class AdminMesasComponent implements OnInit {
  protected mesas: Mesa[];

  constructor(
    private mesaService: MesaService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  ngOnInit(): void {
    this.mesaService.findAll().subscribe({
      next: (response: Response<Mesa[]>) => {
        const { data } = response;
        this.mesas = data;
      },
    });
  }

  showDialog(event: Event, mesa: Mesa): void {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar la mesa?`,
      header: 'Eliminación de mesa',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.eliminarMesa(mesa);
      },
    });
  }

  eliminarMesa(mesa: Mesa) {
    const pos = this.mesas.indexOf(mesa);
    this.mesas = this.mesas.filter((m: Mesa) => {
      return m.id !== mesa.id;
    });
    this.mesaService.delete(mesa.id).subscribe({
      next: (response: Response<any>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.mesas.splice(pos, 0, mesa);
        this.toaster.detailedToast(
          'error',
          'Error al eliminar la mesa',
          error.error.error,
        );
      },
    });
  }

  updateMesa(mesa: Mesa) {
    this.mesas = this.mesas.map((m: Mesa) => {
      if (m.id === mesa.id) {
        return mesa;
      }

      return m;
    });
  }

  pushMesa(mesa: Mesa) {
    this.mesas = [...this.mesas, mesa];
  }
}
