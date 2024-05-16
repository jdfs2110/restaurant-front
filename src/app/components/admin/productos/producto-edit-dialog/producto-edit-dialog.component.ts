import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { ToastService } from '@/app/lib/toast.service';
import { ProductoService } from '@/app/services/producto.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Categoria } from '@/app/types/Categoria';
import { Producto } from '@/app/types/Producto';
import { Response } from '@/app/types/Response';
import { Stock } from '@/app/types/Stock';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-producto-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent,
    ImageModule,
    DropdownModule
  ],
  templateUrl: './producto-edit-dialog.component.html',
  styleUrl: './producto-edit-dialog.component.css'
})
export class ProductoEditDialogComponent implements OnInit {
  @Input({ required: true }) product: Producto;
  @Input({ required: true }) categories: Categoria[]
  @Output() onUpdate = new EventEmitter<Producto>;
  protected stock: Stock;
  protected inputImage: Blob;
  protected currentImage: string = '';

  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected estados: Estado[] = [
    {
      nombre: 'Disponible',
      valor: "1"
    },
    {
      nombre: 'No disponible',
      valor: "0"
    }
  ]

  protected productoForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    precio: new FormControl(0, [Validators.required]),
    activo: new FormControl(1, [Validators.required]),
    foto: new FormControl(null),
    cantidad: new FormControl(0),
    id_categoria: new FormControl(0, [Validators.required])
  })
  protected formdata = new FormData();

  constructor(
    private productoService: ProductoService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService
  ) { }

  showEditDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.currentImage = this.product.foto;
    this.productoForm.controls.nombre.setValue(this.product.nombre);
    this.productoForm.controls.precio.setValue(this.product.precio);
    this.productoForm.controls.activo.setValue(this.product.activo ? 1 : 0);
    this.productoForm.controls.cantidad.setValue(this.product.cantidad);
    this.productoForm.controls.id_categoria.setValue(this.product.id_categoria);
  }

  refresh(event: any) {
    this.currentImage = this.product.foto;
  }

  getNombreErrors() {
    const nombre = this.productoForm.controls.nombre;

    if (nombre.hasError('required')) return this.validationService.requiredMessage();

    if (nombre.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  getPrecioErrors() {
    const precio = this.productoForm.controls.precio;

    if (precio.hasError('required')) return this.validationService.requiredMessage();

    return ''
  }

  getActivoErrors() {
    const activo = this.productoForm.controls.activo;

    if (activo.hasError('required')) return this.validationService.requiredMessage();

    return '';
  }

  getIdCategoriaErrors() {
    const idCategoria = this.productoForm.controls.id_categoria;

    if (idCategoria.hasError('required')) return this.validationService.requiredMessage();

    return '';
  }

  getCantidadErrors() {
    const cantidad = this.productoForm.controls.cantidad;

    return cantidad.hasError('required') ? this.validationService.requiredMessage() : '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar el producto ${this.product.nombre}?`,
      header: 'Editar producto',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { this.onEdit() }
    })
  }

  onEdit() {
    this.submitted = true;
    this.isLoading = true;

    if (this.productoForm.invalid) {
      this.isLoading = false;
      return;
    }

    const nombre = this.productoForm.controls.nombre.value ?? this.product.nombre;
    const precio = this.productoForm.controls.precio.value ?? this.product.precio;
    const activo = this.product.activo ? 1 : 0;
    console.log(activo);

    const cantidad = this.productoForm.controls.cantidad.value ?? this.stock.cantidad;
    const idCategoria = this.productoForm.controls.id_categoria.value ?? this.product.id_categoria;

    this.formdata.set('nombre', nombre);
    this.formdata.set('precio', precio.toString());
    this.formdata.set('activo', activo.toString());
    this.formdata.set('cantidad', cantidad.toString());
    this.formdata.set('id_categoria', idCategoria.toString());

    this.formdata.set('foto', '');

    if (this.inputImage !== undefined) {
      this.formdata.set('foto', this.inputImage);
    }

    this.productoService.update(this.formdata, this.product.id).subscribe({
      next: (response: Response<Producto>) => {
        const { data, message } = response;
        this.onUpdate.emit(data);
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
        if (error.error.error) {
          this.toaster.detailedToast('error', 'Error al actualizar el producto', error.error.error);
        } else {
          this.toaster.smallToast('error', 'Error al actualizar el producto');
        }
      }
    })
  }

  onSelectFile(event: any) {
    this.inputImage = event.target.files[0];
    this.currentImage = URL.createObjectURL(event.target.files[0]);
  }
}

type Estado = {
  nombre: string;
  valor: string;
}