import { ToastService } from '@/app/lib/toast.service';
import { CategoriaService } from '@/app/services/categoria.service';
import { Categoria } from '@/app/types/Categoria';
import { Response } from '@/app/types/Response';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { CategoriaEditDialogComponent } from '../../../components/admin/categorias/categoria-edit-dialog/categoria-edit-dialog.component';
import { ImageModule } from 'primeng/image';
import { CreateCategoryComponent } from '../../../components/admin/categorias/create-category/create-category.component';
import { ProductsByCategoryComponent } from '../../../components/admin/categorias/products-by-category/products-by-category.component';
import env from '@/app/env.json';
@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
  imports: [
    ToolbarModule,
    ButtonModule,
    TableModule,
    AutoCompleteModule,
    CategoriaEditDialogComponent,
    ImageModule,
    CreateCategoryComponent,
    ProductsByCategoryComponent,
  ],
})
export class AdminCategoriasComponent implements OnInit {
  protected totalCategories: number;
  protected paginationLimit: number = 1;
  protected categories: Categoria[] = [];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  protected filteredCategories: any[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  fetchPages() {
    this.categoriaService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalCategories = data;
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

  fetchCategories(page: number) {
    this.categoriaService.findAll(page).subscribe({
      next: (response: Response<Categoria[]>) => {
        const { data } = response;

        this.categories = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadCategories(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.fetchCategories(page);
  }

  showDialog(event: Event, category: Categoria) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar la categoría?',
      header: 'Eliminación de categoría',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteCategory(category);
      },
    });
  }

  deleteCategory(category: Categoria) {
    const pos = this.categories.indexOf(category);
    this.categories = this.categories.filter((c: Categoria) => {
      return c.id !== category.id;
    });
    this.categoriaService.delete(category.id).subscribe({
      next: (response: Response<Categoria>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.categories.splice(pos, 0, category);
        console.log(error);

        this.toaster.detailedToast(
          'error',
          'Error al eliminar la categoría',
          error.error.error,
        );
      },
    });
  }

  filterCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query === '') {
      this.filteredCategories = [];
      return;
    }

    this.categoriaService.findCategoriesWithSimilarName(query).subscribe({
      next: (response: Response<Categoria[]>) => {
        const { data } = response;
        this.filteredCategories = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.categories = [event.value];
    this.totalCategories = 1;
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchCategories(1);
    this.fetchPages();
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync';
  }

  updateCategory(category: Categoria) {
    this.categories = this.categories.map((c: Categoria) => {
      if (c.id === category.id) {
        return category;
      }

      return c;
    });
  }

  setPlaceholder(event: any) {
    event.target.src = env.PLACEHOLDER_PHOTO;
  }
}
