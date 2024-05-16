import { ToastService } from '@/app/lib/toast.service';
import { ProductoService } from '@/app/services/producto.service';
import { StockService } from '@/app/services/stock.service';
import { Producto } from '@/app/types/Producto';
import { Response } from '@/app/types/Response';
import { Stock } from '@/app/types/Stock';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    TableModule,
    AutoCompleteModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-stock.component.html',
  styleUrl: './admin-stock.component.css'
})
export class AdminStockComponent implements OnInit {
  protected totalStock: number;
  protected paginationLimit: number = 1;
  protected stock: Stock[] = [];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  protected filteredProducts: any[] = [];

  constructor(
    private stockService: StockService,
    private productoService: ProductoService,
    private confirmer: ConfirmationService,
    private toaster: ToastService
  ) { }

  fetchPages() {
    this.stockService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalStock = data;
        this.paginationLimit = Number(message);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchPages();
  }

  fetchStock(page: number) {
    this.stockService.findAll(page).subscribe({
      next: (response: Response<Stock[]>) => {
        const { data } = response;

        this.stock = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  loadStock(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = (event.first! / event.rows!) + 1;
    this.fetchStock(page);
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query === '') {
      this.filteredProducts = [];
      return;
    }

    console.log('query', query);


    this.productoService.findProductsWithSimilarName(query).subscribe({
      next: (response: Response<Producto[]>) => {
        const { data } = response;
        this.filteredProducts = data;
        console.log(data);

      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.stock = [event.value];
    this.totalStock = 1;
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchStock(1);
    this.fetchPages();
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync'
  }


}
