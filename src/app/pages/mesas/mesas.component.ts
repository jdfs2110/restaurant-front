import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Mesa } from '@/app/types/Mesa';
import { MesaService } from '@/app/services/mesa.service';
import { Response } from '@/app/types/Response';
import { PedidoService } from '@/app/services/pedido.service';
import { LineaService } from '@/app/services/linea.service';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignalService } from '@/app/services/user.signal.service';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { ErrorPComponent } from "../../components/error-p/error-p.component";
import { Pedido } from '@/app/types/Pedido';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Linea } from '@/app/types/Linea';
@Component({
  selector: 'app-mesas',
  standalone: true,
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css',
  imports: [
    HeaderComponent,
    TabViewModule,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent,
    ProgressSpinnerModule
  ]
})
export class MesasComponent implements OnInit {
  protected mesas: Mesa[] = [];
  protected mesaActual: Mesa = {} as Mesa;
  protected pedidoActual: Pedido = {} as Pedido;
  protected lineas: Linea[] = [];
  protected newPedidoVisible: boolean = false;
  protected viewPedidoVisible: boolean = false;
  protected submitted: boolean = false;
  protected loading: boolean = false;
  protected newPedidoForm = new FormGroup({
    numero_comensales: new FormControl(null, [
      Validators.required
    ]),
    id_mesa: new FormControl(),
    id_usuario: new FormControl()
  })

  get userId(): number {
    return this.userSignal.user().id;
  }

  formatMaxCapacity(capacity: number): string {
    return capacity === 1 ? `${capacity} persona` : `${capacity} personas`
  }

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private lineaService: LineaService,
    private userSignal: UserSignalService,
    private validator: ValidationMessagesService
  ) { }

  ngOnInit(): void {
    this.mesaService.findById(1).subscribe({
      next: (response: Response<Mesa>) => {
        const { data } = response;
        this.mesaActual = data;
      },
      error: (error: any) => {
        console.log('error', error);
      }
    })
    this.mesaService.findAll().subscribe({
      next: (response: Response<Mesa[]>) => {
        const { data } = response;
        this.mesas = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  newPedido(id: number): void {
    this.newPedidoForm.setValue({
      numero_comensales: null,
      id_mesa: id,
      id_usuario: this.userId
    })
    this.newPedidoVisible = true;
  }

  getNumeroComensalesError() {
    if (this.newPedidoForm.controls.numero_comensales.hasError('required')) return this.validator.requiredMessage();
    return '';
  }

  onSubmit(): void {
    this.loading = true;
    this.submitted = true;

    if (this.newPedidoForm.invalid) {
      this.loading = false;
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
        this.mesaActual.estado = "ocupada"
        this.mesaActual.estado_numero = 1
        this.loading = false;
        this.submitted = false;
        this.newPedidoVisible = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.submitted = false;
        console.log('error', error)
      }
    })
  }

  findMesa(event: TabViewChangeEvent) {
    const index = event.index + 1;

    this.mesaService.findById(index).subscribe({
      next: (response: Response<Mesa>) => {
        const { data } = response;
        this.mesaActual = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  servirPedido(idMesa: number) {
    this.loading = true;
    this.mesaService.findLastPedido(idMesa).subscribe({
      next: (response: Response<Pedido>) => {
        const { data } = response;
        this.markAsServido(data.id)
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  markAsServido(id: number) {
    this.pedidoService.servirPedido(id).subscribe({
      next: (response: Response<any>) => {
        this.loading = false;
        console.log(response.message)
        this.mesaActual.estado_numero = 0
        this.mesaActual.estado = 'libre';
      },
      error: (error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    })
  }

  verPedido(idMesa: number) {
    this.viewPedidoVisible = true;
    this.mesaService.findLastPedido(idMesa).subscribe({
      next: (response: Response<Pedido>) => {
        const { data } = response;
        this.pedidoActual = data;
        this.findLineasByPedido(data.id)
      }
    })
  }

  findLineasByPedido(idPedido: number) {
    this.pedidoService.getLineas(idPedido).subscribe({
      next: (response: Response<Linea[]>) => {
        const { data } = response
        this.lineas = data;
      }
    })
  }
}

