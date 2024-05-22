import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Mesa } from '@/app/types/Mesa';
import { MesaService } from '@/app/services/mesa.service';
import { Response } from '@/app/types/Response';
import { PedidoService } from '@/app/services/pedido.service';
import { LineaService } from '@/app/services/linea.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserSignalService } from '@/app/services/user.signal.service';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { ErrorPComponent } from '../../components/error-p/error-p.component';
import { Pedido } from '@/app/types/Pedido';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Linea, LineaCompleted } from '@/app/types/Linea';
import { ToastService } from '@/app/lib/toast.service';
import { CreatePedidoComponent } from './create-pedido.component';
import { PusherService } from '@/app/services/pusher.service';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { Producto } from '@/app/types/Producto';
import { TabViewModule } from 'primeng/tabview';
import { ProductoService } from '@/app/services/producto.service';
import { RippleModule } from 'primeng/ripple';
import { EditLineaComponent } from './edit-linea.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AudioService } from '@/app/lib/audio.service';
import env from '@/app/env.json';
@Component({
  selector: 'app-mesas',
  standalone: true,
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css',
  imports: [
    HeaderComponent,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent,
    ProgressSpinnerModule,
    CreatePedidoComponent,
    PanelModule,
    AvatarModule,
    TabViewModule,
    RippleModule,
    EditLineaComponent,
    ConfirmDialogModule,
  ],
})
export class MesasComponent implements OnInit, OnDestroy {
  protected mesas: Mesa[] = [];
  protected newLineaVisible: boolean = false;
  protected submitted: boolean = false;
  protected loading: boolean = false;

  protected pedidoActual: Pedido = {} as Pedido;
  protected mesaSelected: Mesa = {} as Mesa;
  protected productoActual: Producto = {} as Producto;
  protected selectedTipo: 'barra' | 'cocina';
  protected lineas: Linea[] = [];

  protected productos: Producto[] = [];
  protected productosCocina: Producto[] = [];
  protected productosCocinaFiltered: Producto[] = [];
  protected productosBarraFiltered: Producto[] = [];
  protected productosBarra: Producto[] = [];

  protected lineasVisible: boolean = false;
  protected newLineaFormVisible: boolean = false;

  protected newLineaForm = new FormGroup({
    cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  getCantidadErrors() {
    const cantidad = this.newLineaForm.controls.cantidad;

    if (cantidad.hasError('required'))
      return this.validationService.requiredMessage();

    if (cantidad.hasError('min')) return 'Debes poner al menos 1 de cantidad.';

    return '';
  }

  get userId(): number {
    return this.userSignal.user().id;
  }

  formatMaxCapacity(capacity: number): string {
    return capacity === 1 ? `${capacity} persona` : `${capacity} personas`;
  }

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private lineaService: LineaService,
    private userSignal: UserSignalService,
    private toaster: ToastService,
    private pusher: PusherService,
    private productoService: ProductoService,
    private validationService: ValidationMessagesService,
    private confirmer: ConfirmationService,
    private audioService: AudioService,
  ) { }

  ngOnInit(): void {
    this.mesaService.findAll().subscribe({
      next: (response: Response<Mesa[]>) => {
        const { data } = response;
        this.mesas = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });

    this.fetchProducts();

    setInterval(() => {
      this.fetchProducts();
    }, 120000);

    const channel = this.pusher.listenTo('mesas');
    channel.bind('mesa-edited', (event: Response<Mesa>) => {
      const { data } = event;
      console.log(event);
      this.mesas = this.mesas.map((mesa: Mesa) => {
        if (mesa.id === data.id) {
          return data;
        }

        return mesa;
      });
    });

    const notifications = this.pusher.listenTo('lineas-notifications');
    notifications.bind('linea-completed', (notification: LineaCompleted) => {
      const { id, message, ocurredOn } = notification;
      console.log(notification);
      this.audioService.notification();
      this.toaster.longerDetailedToast('info', 'Línea a recoger', message);
    });
  }

  ngOnDestroy(): void {
    this.pusher.listenTo('mesas').unbind_all();
    this.pusher.listenTo('lineas-notifications').unbind_all();
  }

  fetchProducts() {
    this.productoService.all().subscribe({
      next: (response: Response<Producto[]>) => {
        const { data } = response;
        this.productos = data.filter((producto: Producto) => {
          return producto.cantidad > 0 && producto.activo;
        });
        this.productosCocina = this.productos.filter(
          (producto) => producto.id_categoria !== 1,
        );
        this.productosCocinaFiltered = this.productosCocina;
        this.productosBarra = this.productos.filter(
          (producto) => producto.id_categoria === 1,
        );
        this.productosBarraFiltered = this.productosBarra;
      },
    });
  }

  ocuparMesa(mesa: Mesa) {
    const pos = this.mesas.indexOf(mesa);
    this.mesas[pos].estado_numero = 1;
    this.mesas[pos].estado = 'ocupada';
  }

  showServirDialog(event: Event, mesa: Mesa) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea servir el pedido?`,
      header: 'Servir pedido',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.servirPedido(mesa);
      },
    });
  }

  servirPedido(mesa: Mesa) {
    this.mesaService.findLastPedido(mesa.id).subscribe({
      next: (response: Response<Pedido>) => {
        const { data } = response;
        this.markAsServido(data.id, mesa);
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.smallToast('error', 'Error al servir el pedido');
      },
    });
  }

  markAsServido(idPedido: number, mesa: Mesa) {
    const pos = this.mesas.indexOf(mesa);
    this.mesas[pos].estado_numero = 0;
    this.mesas[pos].estado = 'libre';
    this.pedidoService.servirPedido(idPedido).subscribe({
      next: (response: Response<any>) => {
        console.log(response.message);
      },
      error: (error: any) => {
        console.log('error', error);
        this.toaster.smallToast('error', 'Error al servir el pedido');
        this.mesas[pos].estado_numero = mesa.estado_numero;
        this.mesas[pos].estado = mesa.estado;
      },
    });
  }

  nuevaLinea(mesa: Mesa) {
    this.newLineaVisible = true;
    this.mesaSelected = mesa;
    this.mesaService.findLastPedido(mesa.id).subscribe({
      next: (response: Response<Pedido>) => {
        const { data } = response;
        this.pedidoActual = data;
      },
    });
  }

  verLineas(mesa: Mesa) {
    this.mesaSelected = mesa;
    this.lineasVisible = true;
    this.mesaService.findLastPedido(mesa.id).subscribe({
      next: (response: Response<Pedido>) => {
        const { data } = response;
        this.pedidoActual = data;
        this.findLineasByPedido(data.id);
      },
    });
  }

  findLineasByPedido(idPedido: number) {
    this.pedidoService.getLineas(idPedido).subscribe({
      next: (response: Response<Linea[]>) => {
        if (response === null) return;
        const { data } = response;
        this.lineas = data;
      },
    });
  }

  refreshMesa() {
    this.mesaSelected = {} as Mesa;
    // this.pedidoActual = {} as Pedido;
  }

  setPlaceholder(event: any) {
    event.target.src = env.PLACEHOLDER_PHOTO;
  }

  filterProduct(event: any, tipo: 'barra' | 'cocina') {
    const query = event.target.value;

    if (tipo === 'cocina') {
      if (query === '') this.productosCocinaFiltered = this.productosCocina;
      else
        this.productosCocinaFiltered = this.productosCocina.filter((producto) =>
          this.removeAccent(producto.nombre).includes(this.removeAccent(query)),
        );
    } else {
      if (query === '') this.productosBarraFiltered = this.productosBarra;
      else
        this.productosBarraFiltered = this.productosBarra.filter((producto) =>
          this.removeAccent(producto.nombre).includes(this.removeAccent(query)),
        );
    }
  }

  removeAccent(str: string) {
    return str
      .toLowerCase()
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ú', 'u');
  }

  newLinea(producto: Producto, tipo: 'barra' | 'cocina') {
    this.productoActual = producto;
    this.selectedTipo = tipo;
    this.newLineaVisible = false;
    this.newLineaFormVisible = true;
  }

  showPreviousDialog() {
    this.newLineaForm.reset();
    this.newLineaVisible = true;
    this.newLineaFormVisible = false;
    this.submitted = false;
    this.loading = false;
    // this.productoActual = {} as Producto;
  }

  onCreate() {
    this.submitted = true;
    this.loading = true;
    const formValue = this.newLineaForm.value;

    if (this.newLineaForm.invalid) {
      this.loading = false;
      return;
    }

    console.log(formValue);
    console.log('selected tipo', this.selectedTipo);
    console.log('producto', this.productoActual);
    console.log('pedido', this.pedidoActual);

    const newLinea: Linea = {
      id: 0,
      precio: this.productoActual.precio,
      id_producto: this.productoActual.id,
      cantidad: formValue.cantidad ?? 0,
      producto: '',
      producto_foto: '',
      id_pedido: this.pedidoActual.id,
      tipo: this.selectedTipo,
      estado: '',
      estado_numero: 0,
    };

    this.lineaService.create(newLinea).subscribe({
      next: (response: Response<Linea>) => {
        console.log(response);
        this.loading = false;
        this.submitted = false;
        this.productoActual.cantidad -= formValue.cantidad ?? 0;
        this.toaster.smallToast('success', 'Producto añadido correctamente.');
        this.showPreviousDialog();
      },
      error: (error: any) => {
        console.log(error);
        if (error.error.error) {
          console.log(error.error.error);
          this.toaster.detailedToast('error', 'Error al añadir el producto', error.error.error)
        } else {
          this.toaster.smallToast('error', 'Error al añadir el producto');
        }
        this.loading = false;
        this.submitted = false;
      },
    });
  }

  updateLinea(linea: Linea) {
    this.lineas = this.lineas.map((l: Linea) => {
      if (l.id === linea.id) {
        return linea;
      }

      return l;
    });
  }

  updateProducto(producto: Producto) {
    const breakException = {};
    try {
      this.productos.forEach((p: Producto) => {
        if (p.id === producto.id) {
          p.cantidad = producto.cantidad;
          throw breakException;
        }
      });
    } catch (e) {
      // console.log(e);
    }
  }

  showDeletion(event: Event, linea: Linea) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar la línea?`,
      header: 'Eliminar línea',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteLinea(linea);
      },
    });
  }

  deleteLinea(linea: Linea) {
    const pos = this.lineas.indexOf(linea);
    this.lineas = this.lineas.filter((l: Linea) => {
      return l.id !== linea.id;
    });
    this.lineaService.delete(linea.id).subscribe({
      next: (response: Response<Linea>) => {
        const { message } = response;
        console.log(message);
        const breakException = {};
        try {
          this.productos.forEach((producto: Producto) => {
            if (producto.id === linea.id_producto) {
              producto.cantidad += linea.cantidad;
              throw breakException;
            }
          });
        } catch (e) {
          // console.log('linea eliminada, stock actualizado');
        }
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.lineas.splice(pos, 0, linea);
        this.toaster.smallToast('error', 'Error al eliminar la línea');
      },
    });
  }
}
