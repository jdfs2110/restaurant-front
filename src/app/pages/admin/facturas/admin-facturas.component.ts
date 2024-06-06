import { ToastService } from '@/app/lib/toast.service';
import { FacturaService } from '@/app/services/factura.service';
import { Factura } from '@/app/types/Factura';
import { Response } from '@/app/types/Response';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-admin-facturas',
  standalone: true,
  imports: [TableModule, ButtonModule, ToolbarModule],
  templateUrl: './admin-facturas.component.html',
  styleUrl: './admin-facturas.component.css',
})
export class AdminFacturasComponent implements OnInit {
  protected totalFacturas: number;
  protected paginationLimit: number = 1;
  protected facturas: Factura[] = [];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  constructor(
    private facturaService: FacturaService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  fetchPages() {
    this.facturaService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalFacturas = data;
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

  fetchFacturas(page: number) {
    this.facturaService.findAll(page).subscribe({
      next: (response: Response<Factura[]>) => {
        const { data } = response;

        this.facturas = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadFacturas(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.fetchFacturas(page);
  }

  showDialog(event: Event, factura: Factura) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar la Factura?',
      header: 'Eliminación de factura',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteFactura(factura);
      },
    });
  }

  deleteFactura(factura: Factura) {
    const pos = this.facturas.indexOf(factura);
    this.facturas = this.facturas.filter((f: Factura) => {
      return f.id !== factura.id;
    });
    this.facturaService.delete(factura.id).subscribe({
      next: (response: Response<Factura>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.facturas.splice(pos, 0, factura);
        this.toaster.smallToast('error', 'Error al eliminar la factura');
      },
    });
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchFacturas(1);
    this.fetchPages();
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync';
  }
}
