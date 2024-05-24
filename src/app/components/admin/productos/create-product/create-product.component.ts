import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { ToastService } from '@/app/lib/toast.service';
import { ProductoService } from '@/app/services/producto.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import env from '@/app/env.json';
import { Response } from '@/app/types/Response';
import { Producto } from '@/app/types/Producto';
import { Categoria } from '@/app/types/Categoria';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ImageModule,
    ErrorPComponent,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  @Input({ required: true }) categories: Categoria[];
  @Output() onCreate = new EventEmitter();
  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;
  protected fotoError: boolean = false;

  protected inputImage: Blob;
  protected currentImage: string = env.PLACEHOLDER_PHOTO;

  protected productoForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    precio: new FormControl(null, [Validators.required]),
    id_categoria: new FormControl(null, [Validators.required]),
    cantidad: new FormControl(null, [Validators.required]),
    foto: new FormControl(null, [Validators.required]),
  });

  constructor(
    private productoService: ProductoService,
    private validationService: ValidationMessagesService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  showDialog() {
    this.isVisible = true;
  }

  refresh(event: any) {
    this.productoForm.reset();
    this.isLoading = false;
    this.submitted = false;
    this.currentImage = env.PLACEHOLDER_PHOTO;
  }

  getNombreErrors() {
    const nombre = this.productoForm.controls.nombre;

    if (nombre.hasError('required'))
      return this.validationService.requiredMessage();

    if (nombre.hasError('maxlength'))
      return this.validationService.maxLength(40);

    return '';
  }

  getPrecioErrors() {
    const precio = this.productoForm.controls.precio;

    return precio.hasError('required')
      ? this.validationService.requiredMessage()
      : '';
  }

  getIdCategoriaErrors() {
    const idCategoria = this.productoForm.controls.id_categoria;

    return idCategoria.hasError('required')
      ? 'Debes seleccionar una categoría'
      : '';
  }

  getCantidadErrors() {
    const cantidad = this.productoForm.controls.cantidad;

    return cantidad.hasError('required')
      ? this.validationService.requiredMessage()
      : '';
  }

  getFotoErrors() {
    const foto = this.productoForm.controls.foto;

    if (foto.hasError('required')) return 'Debes elegir una foto.';

    return '';
  }

  onSelectFile(event: any) {
    this.inputImage = event.target.files[0];
    if (this.inputImage !== null)
      this.currentImage = URL.createObjectURL(event.target.files[0]);
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea crear el producto?`,
      header: 'Crear producto',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.create();
      },
    });
  }

  create() {
    const formdata = new FormData();
    this.submitted = true;
    this.isLoading = true;

    if (this.productoForm.invalid) {
      this.isLoading = false;
      return;
    }

    const nombre = this.productoForm.value.nombre ?? '';
    const precio = this.productoForm.value.precio ?? 0;
    const idCategoria = this.productoForm.value.id_categoria ?? 0;
    const cantidad = this.productoForm.value.cantidad ?? 0;
    formdata.set('nombre', nombre);
    formdata.set('precio', precio.toString());
    formdata.set('id_categoria', idCategoria.toString());
    formdata.set('cantidad', cantidad.toString());
    formdata.set('foto', this.inputImage);

    this.productoService.create(formdata).subscribe({
      next: (response: Response<Producto>) => {
        const { message } = response;
        this.onCreate.emit();
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.isVisible = false;
        this.submitted = false;
      },
      error: (error: any) => {
        if (error.error.error) {
          this.isLoading = false;
          this.toaster.detailedToast(
            'error',
            'Error al crear el producto',
            error.error.error,
          );
        } else {
          this.toaster.smallToast('error', 'Error al crear el producto');
        }
      },
    });
  }
}
