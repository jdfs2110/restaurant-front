import { Linea } from '@/app/types/Linea';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorPComponent } from '../../components/error-p/error-p.component';
import { LineaService } from '@/app/services/linea.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@/app/lib/toast.service';
import { Response } from '@/app/types/Response';
import { ProductoService } from '@/app/services/producto.service';
import { Producto } from '@/app/types/Producto';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-edit-linea',
  standalone: true,
  templateUrl: './edit-linea.component.html',
  styles: `
    label {
      display: block;
      font-size: 16px;
    }
  `,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ErrorPComponent,
    InputNumberModule,
  ],
})
export class EditLineaComponent implements OnInit {
  @Input({ required: true }) linea: Linea;
  // @Input({ required: true }) currentStock: number;
  @Output() onUpdate = new EventEmitter<Linea>();
  @Output() updatedProduct = new EventEmitter<Producto>();
  protected newStock: number;
  protected producto: Producto;
  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected lineaForm = new FormGroup({
    cantidad: new FormControl(0, [Validators.required]),
  });

  constructor(
    private lineaService: LineaService,
    private validationService: ValidationMessagesService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
    private productoService: ProductoService,
  ) {}

  getCantidadErrors() {
    const cantidad = this.lineaForm.controls.cantidad;

    return cantidad.hasError('required')
      ? this.validationService.requiredMessage()
      : '';
  }

  ngOnInit(): void {
    this.lineaForm.setValue({
      cantidad: this.linea.cantidad,
    });
    this.productoService.findById(this.linea.id_producto).subscribe({
      next: (response: Response<Producto>) => {
        const { data } = response;
        this.producto = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  refresh() {
    this.ngOnInit();
  }

  showDialog() {
    this.isVisible = true;
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea crear editar la línea?`,
      header: 'Editar línea',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.editLinea();
      },
    });
  }

  editLinea() {
    const form = this.lineaForm.value;
    this.submitted = true;
    this.isLoading = true;

    if (this.lineaForm.invalid) {
      this.isLoading = false;
      return;
    }

    const lineaEdited: Linea = {
      id: 0,
      precio: this.linea.precio,
      cantidad: form.cantidad ?? this.linea.cantidad,
      id_producto: this.linea.id_producto,
      id_pedido: this.linea.id_pedido,
      producto: '',
      producto_foto: '',
      tipo: this.linea.tipo,
      estado: this.linea.estado_numero,
      estado_numero: 0,
    };

    this.lineaService.update(lineaEdited, this.linea.id).subscribe({
      next: (response: Response<Linea>) => {
        const { data, message } = response;
        console.log(response);
        this.toaster.smallToast('success', message);
        this.onUpdate.emit(data);

        this.isLoading = false;

        if (this.lineaForm.value.cantidad! < this.linea.cantidad) {
          console.log('estoy quitando cantidad');
          this.newStock =
            this.producto.cantidad +
            (this.linea.cantidad - this.lineaForm.value.cantidad!);
          this.producto.cantidad = this.newStock;
          this.updatedProduct.emit(this.producto);
        } else if (this.lineaForm.value.cantidad! > this.linea.cantidad) {
          console.log('estoy metiendo cantidad');
          this.newStock =
            this.producto.cantidad -
            (this.lineaForm.value.cantidad! - this.linea.cantidad);
          this.producto.cantidad = this.newStock;
          this.updatedProduct.emit(this.producto);
        } else {
          console.log('no estoy cambiando nada');
          this.updatedProduct.emit(this.producto);
        }
      },
      error: (error: any) => {
        console.log(error);
        if (error.error.error) {
          this.toaster.detailedToast(
            'error',
            'Error al actualizar la línea',
            error.error.error,
          );
        } else {
          this.toaster.smallToast('error', 'Error al actualizar la línea.');
        }
        this.isLoading = false;
      },
    });
  }
}
