import { ToastService } from '@/app/lib/toast.service';
import { ProductoService } from '@/app/services/producto.service';
import { Producto } from '@/app/types/Producto';
import { Response } from '@/app/types/Response';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductoEditDialogComponent } from '../../../components/admin/productos/producto-edit-dialog/producto-edit-dialog.component';
import { Categoria } from '@/app/types/Categoria';
import { CategoriaService } from '@/app/services/categoria.service';
import { CreateProductComponent } from '../../../components/admin/productos/create-product/create-product.component';
import env from '@/app/env.json';
@Component({
  selector: 'app-admin-productos',
  standalone: true,
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css',
  imports: [
    ToolbarModule,
    ButtonModule,
    TableModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ImageModule,
    ProductoEditDialogComponent,
    CreateProductComponent,
  ],
})
export class AdminProductosComponent implements OnInit {
  protected totalProducts: number;
  protected paginationLimit: number = 1;
  protected products: Producto[] = [];
  protected categories: Categoria[] = [];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  protected filteredProducts: any[] = [];

  constructor(
    private productoService: ProductoService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
    private categoriaService: CategoriaService,
  ) {}

  fetchPages() {
    this.productoService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalProducts = data;
        this.paginationLimit = Number(message);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  ngOnInit(): void {
    this.loading = true;
    this.fetchPages();
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoriaService.all().subscribe({
      next: (response: Response<Categoria[]>) => {
        const { data } = response;
        this.categories = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  fetchProducts(page: number) {
    this.productoService.findAll(page).subscribe({
      next: (response: Response<Producto[]>) => {
        console.log(response);
        const { data } = response;

        this.products = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadProducts(event: TableLazyLoadEvent) {
    console.log('lazy');

    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.fetchProducts(page);
  }

  showDialog(event: Event, product: Producto) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar el producto?',
      header: 'Eliminación de producto',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        console.log('accepted');
      },
    });
  }

  deleteProduct(product: Producto) {
    const pos = this.products.indexOf(product);
    this.products = this.products.filter((p: Producto) => {
      return p.id !== product.id;
    });
    this.productoService.delete(product.id).subscribe({
      next: (response: Response<Producto>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.products.splice(pos, 0, product);
        if (error.error.error) {
          this.toaster.detailedToast(
            'error',
            'Error al eliminar el producto',
            error.error.error,
          );
        } else {
          this.toaster.smallToast('error', 'Error al eliminar el producto');
        }
      },
    });
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query === '') {
      this.filteredProducts = [];
      return;
    }

    this.productoService.findProductsWithSimilarName(query).subscribe({
      next: (response: Response<Producto[]>) => {
        const { data } = response;
        this.filteredProducts = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.findById(event.value.id);
    this.totalProducts = 1;
  }

  findById(id: number) {
    this.productoService.findById(id).subscribe({
      next: (response: Response<Producto>) => {
        this.products = [response.data];
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  setPlaceholder(event: any) {
    event.target.src = env.PLACEHOLDER_PHOTO;
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchProducts(1);
    this.fetchPages();
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync';
  }

  updateProduct(product: Producto) {
    this.products = this.products.map((p: Producto) => {
      if (p.id === product.id) {
        return product;
      }

      return p;
    });
  }
}
