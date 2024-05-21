import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Producto } from '@/app/types/Producto';
import { ProductoService } from '@/app/services/producto.service';
import { Response } from '@/app/types/Response';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import env from '@/app/env.json';
@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  imports: [
    HeaderComponent,
    AccordionModule,
    AvatarModule
  ]
})
export class ProductosComponent implements OnInit {
  protected productos: Producto[] = [];

  constructor(
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.productoService.all().subscribe({
      next: (response: Response<Producto[]>) => {
        const { data } = response;
        this.productos = data;
      },
      error: (error: any) => { console.log(error) }
    })
  }

  setPlaceholder(event: any) {
    event.target.src = env.PLACEHOLDER_PHOTO;
  }
}
