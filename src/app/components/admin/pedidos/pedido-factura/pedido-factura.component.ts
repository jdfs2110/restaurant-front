import { PedidoService } from '@/app/services/pedido.service';
import { Linea } from '@/app/types/Linea';
import { Pedido } from '@/app/types/Pedido';
import { Response } from '@/app/types/Response';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-pedido-factura',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './pedido-factura.component.html',
  styleUrl: './pedido-factura.component.css',
})
export class PedidoFacturaComponent {
  @Input({ required: true }) pedido: Pedido;
  protected lineasTicket: Linea[] = [];
  protected isVisible: boolean = false;
  protected fecha: string = '';

  protected _pedidoService: PedidoService = inject(PedidoService);

  showTicketDialog(): void {
    this.isVisible = true;
    this.handleTicket();
  }

  handleTicket(): void {
    this._pedidoService.getLineas(this.pedido.id).subscribe({
      next: (res: Response<Linea[]>) => {
        if (res === null) return;
        this.lineasTicket = res.data;
        console.log(this.lineasTicket);
        const lineasAgrupadas: Linea[] = [];
        this.lineasTicket.forEach((linea: Linea) => {
          let updated = false;
          lineasAgrupadas.forEach((l: Linea) => {
            if (linea.id_producto === l.id_producto) {
              l.cantidad += linea.cantidad;
              updated = true;
            }
          });

          if (!updated) {
            lineasAgrupadas.push(linea);
          }
        });

        this.lineasTicket = lineasAgrupadas;
      },
    });

    const date = new Date();
    this.fecha = this.formatDate(date);
  }

  refreshTicket(): void {
    this.lineasTicket = [];
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [day, month, year].join('/');
  }
}
