import { ToastService } from "@/app/lib/toast.service";
import { PedidoService } from "@/app/services/pedido.service";
import { ValidationMessagesService } from "@/app/services/validation-messages.service";
import { Mesa } from "@/app/types/Mesa";
import { Pedido } from "@/app/types/Pedido";
import { Response } from "@/app/types/Response";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ErrorPComponent } from "../../components/error-p/error-p.component";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: 'app-create-pedido',
  standalone: true,
  templateUrl: './create-pedido.component.html',
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    ErrorPComponent,
    InputTextModule
  ]
})
export class CreatePedidoComponent {
  @Input({ required: true }) mesa: Mesa;
  @Input({ required: true }) userId: number;
  @Output() onNewPedido = new EventEmitter<Mesa>;

  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected newPedidoForm = new FormGroup({
    numero_comensales: new FormControl(null, [
      Validators.required
    ]),
    id_mesa: new FormControl(),
    id_usuario: new FormControl()
  })

  constructor(
    private pedidoService: PedidoService,
    private validator: ValidationMessagesService,
    private toaster: ToastService
  ) { }

  newPedido(id: number): void {
    this.newPedidoForm.setValue({
      numero_comensales: null,
      id_mesa: id,
      id_usuario: this.userId
    })
    this.isVisible = true;
  }

  getNumeroComensalesError() {
    if (this.newPedidoForm.controls.numero_comensales.hasError('required')) return this.validator.requiredMessage();
    return '';
  }

  onCreate(): void {
    this.isLoading = true;
    this.submitted = true;

    if (this.newPedidoForm.invalid) {
      this.isLoading = false;
      return;
    }

    const pedido: Pedido = {
      id: 0,
      estado: 0,
      estado_numero: 0,
      fecha: new Date(),
      precio: 0,
      numero_comensales: this.newPedidoForm.value.numero_comensales ?? 0,
      id_mesa: this.newPedidoForm.value.id_mesa,
      id_usuario: this.newPedidoForm.value.id_usuario
    }

    console.log(pedido);

    this.pedidoService.create(pedido).subscribe({
      next: (response: Response<Pedido>) => {
        console.log(response);
        this.onNewPedido.emit(this.mesa);
        this.isLoading = false;
        this.submitted = false;
        this.isVisible = false;
        this.toaster.smallToast('success', 'Pedido creado correctamente');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.submitted = false;
        console.log('error', error);
        this.toaster.smallToast('error', 'Error al crear el pedido');
      }
    })
  }

}