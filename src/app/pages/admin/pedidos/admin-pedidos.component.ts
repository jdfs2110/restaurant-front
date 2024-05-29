import { ToastService } from '@/app/lib/toast.service';
import { PedidoService } from '@/app/services/pedido.service';
import { Pedido } from '@/app/types/Pedido';
import { Response } from '@/app/types/Response';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { LineasByPedidoComponent } from '../../../components/admin/pedidos/lineas-by-pedido/lineas-by-pedido.component';
import { PedidoFacturaComponent } from '../../../components/admin/pedidos/pedido-factura/pedido-factura.component';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  templateUrl: './admin-pedidos.component.html',
  styleUrl: './admin-pedidos.component.css',
  imports: [
    TableModule,
    ButtonModule,
    ToolbarModule,
    LineasByPedidoComponent,
    PedidoFacturaComponent,
  ],
})
export class AdminPedidosComponent implements OnInit {
  protected totalPedidos: number;
  protected paginationLimit: number = 1;
  protected pedidos: Pedido[] = [];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  constructor(
    private pedidoService: PedidoService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  fetchPages() {
    this.pedidoService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalPedidos = data;
        this.paginationLimit = Number(message);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.loading = true;
    this.fetchPages();
  }

  fetchPedidos(page: number) {
    this.pedidoService.findAll(page).subscribe({
      next: (response: Response<Pedido[]>) => {
        const { data } = response;

        this.pedidos = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadPedidos(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.fetchPedidos(page);
  }

  showDialog(event: Event, pedido: Pedido) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar el Pedido?',
      header: 'Eliminación de pedido',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletePedido(pedido);
      },
    });
  }

  deletePedido(pedido: Pedido) {
    const pos = this.pedidos.indexOf(pedido);
    this.pedidos = this.pedidos.filter((p: Pedido) => {
      return p.id !== pedido.id;
    });
    this.pedidoService.delete(pedido.id).subscribe({
      next: (response: Response<Pedido>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.pedidos.splice(pos, 0, pedido);
        this.toaster.smallToast('error', 'Error al eliminar el pedido');
      },
    });
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchPedidos(1);
    this.fetchPages();
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync';
  }

  // updatePedido(pedido: Pedido) {
  //   this.pedidos = this.pedidos.map((p: Pedido) => {
  //     if (p.id === pedido.id) {
  //       return pedido;
  //     }

  //     return p;
  //   })
  // }
}
