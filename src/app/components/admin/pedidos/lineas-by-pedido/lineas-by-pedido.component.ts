import { ToastService } from '@/app/lib/toast.service';
import { LineaService } from '@/app/services/linea.service';
import { PedidoService } from '@/app/services/pedido.service';
import { Linea } from '@/app/types/Linea';
import { Pedido } from '@/app/types/Pedido';
import { Response } from '@/app/types/Response';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lineas-by-pedido',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './lineas-by-pedido.component.html',
  styleUrl: './lineas-by-pedido.component.css'
})
export class LineasByPedidoComponent implements OnInit {
  @Input({ required: true }) pedido: Pedido;
  protected isVisible: boolean = false;
  protected lineas: Linea[];

  constructor(
    private pedidoService: PedidoService,
    private lineaService: LineaService,
    private confirmer: ConfirmationService,
    private toaster: ToastService
  ) { }

  showLineasDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.pedidoService.getLineas(this.pedido.id).subscribe({
      next: (response: Response<Linea[]>) => {
        if (response === null) return;
        this.lineas = response.data
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.detailedToast('error', 'Ha ocurrido un error', `Ha ocurrido un error intentando obtener los usuarios del pedido ${this.pedido.id}`);
      }
    })
  }

  showDialog(event: Event, linea: Linea) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar la Línea?',
      header: 'Eliminación de línea',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { this.deleteLinea(linea) }
    });
  }

  deleteLinea(linea: Linea) {
    const pos = this.lineas.indexOf(linea);
    this.lineas = this.lineas.filter((l: Linea) => { return l.id !== linea.id });
    this.lineaService.delete(linea.id).subscribe({
      next: (response: Response<Linea>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.lineas.splice(pos, 0, linea);
        this.toaster.smallToast('error', 'Error al eliminar la línea')
      }
    })
  }


}
