import { ToastService } from '@/app/lib/toast.service';
import { CategoriaService } from '@/app/services/categoria.service';
import { Categoria } from '@/app/types/Categoria';
import { Producto } from '@/app/types/Producto';
import { Response } from '@/app/types/Response';
import { Stock } from '@/app/types/Stock';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    DataViewModule,
    CommonModule
  ],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.css'
})
export class ProductsByCategoryComponent implements OnInit {
  @Input({ required: true }) category: Categoria;
  protected isVisible: boolean = false;
  protected products: Producto[] = [];

  protected first: number;
  protected rows: 10;

  constructor(
    private categoriaService: CategoriaService,
    private toaster: ToastService
  ) { }

  showDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.categoriaService.findAllProductsByCategoryId(this.category.id).subscribe({
      next: (response: Response<Producto[]>) => {
        if (response === null) return;

        const { data } = response;

        this.products = data;
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.detailedToast('error', 'Ha ocurrido un error', `Ha ocurrido un error intentando obtener los productos de la categoría ${this.category.nombre}`)

      }
    })
  }

  setPlaceholder(event: any) {
    event.target.src = '/assets/images/placeholder.jpg';
  }
}
