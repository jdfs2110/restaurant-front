# Restaurant front

## TODO

- [ ] todo 😭
- [ ] CHECK MESAS TODO
- [x] File uploading (foto categoría, producto)
- [x] arreglar el cierre de sesión cuando se pone ulr a pelo (ej: /lineas/cocina) y las cookies duplicadas
- [ ] cuando el stock de un producto llega a 0 se inhabilita
- [ ] que la cantidad de stock no pueda ser negativa al añadir/editar la línea del producto
- [ ] que el dropdown de estado de pedido en cocina no salga para cambiar a 'servido'
- [ ] buscar nuevas imagenes para los productos (las actuales son horribles)

### Schizo posting

será que devuelvo el created_at de las lineas para filtrar por fecha en el dashboard de cocina/barra?

#### Mini esquema de navegación

2 dashboards distintos [cocina, mesero] ¿?

dashboard Cocina && Barra

- Productos (?)
- Lineas

dashboard Mesero

- Stock
- Productos
- Mesas > pedidos
- Mesas > new pedido
- Lineas > new linea
- Pedidos > new pedido
- Pedidos > pedido > lineas
- Facturas (generar factura)

Admin panel (absolutamente todo 😲😲)

- [x] MegaMenu con categorias y to eso o que?

--------

```html
<app-header></app-header>
<main>

  @defer {
  <div class="card md:hidden">
    <p-tabView [scrollable]="true" (onChange)="findMesa($event)">
      @for (mesa of mesas; track mesa.id) {
      <p-tabPanel [header]="'Mesa ' + mesa.id.toString()">

        <p-card [header]="'Mesa ' + mesa.id"
          [subheader]="'Capacidad máxima: ' + formatMaxCapacity(mesa.capacidad_maxima)">

          <p>Estado: {{ mesaActual.estado }}</p>

          <ng-template pTemplate="footer">
            @if (mesaActual.estado_numero === 1) {
            <div class="flex flex-row gap-2 w-full">
              <div class="flex-1">
                <p-button styleClass="w-full" label="Servir" (onClick)="servirPedido(mesaActual.id)" [loading]="loading"
                  iconPos="right" />
              </div>
              <div class="flex-1">
                <p-button styleClass="w-full" label="Ver pedido" (onClick)="verPedido(mesaActual.id)" /> <!--TODO-->
              </div>
            </div>
            } @else {
            <p-button label="Nuevo pedido" styleClass="w-full" (onClick)="newPedido(mesa.id)" />
            }
          </ng-template>

        </p-card>

      </p-tabPanel>
      }
    </p-tabView>
  </div>
  }

  @placeholder {
  <div class="flex justify-content-center align-items-center min-h-screen gap-4">
    <p>Cargando...</p>
    <p-progressSpinner ariaLabel="loading" styleClass="w-4rem h-4rem" strokeWidth="5" animationDuration=".5s" />
  </div>
  }

  <div class="card flex justify-content-center">
    <p-dialog [(visible)]="newPedidoVisible" [maximizable]="true" [modal]="true" header="Nuevo pedido"
      [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [draggable]="false">
      <form [formGroup]="newPedidoForm" (submit)="onSubmit()">

        <div class="field">
          <label for="numero_comensales">Número de comensales</label>
          <input type="number" pInputText formControlName="numero_comensales" class="w-full px-2">
          @if (submitted && newPedidoForm.controls.numero_comensales.invalid) {
          <error-p>{{getNumeroComensalesError()}}</error-p>
          }
        </div>

        <div class="field">
          <label for="id_mesa">ID de Mesa</label>
          <input type="number" pInputText readonly formControlName="id_mesa" class="w-full px-2">
        </div>

        <div class="field">
          <label for="id_usuario">ID de Empleado</label>
          <input type="number" pInputText readonly formControlName="id_usuario" class="w-full px-2">
        </div>

        <p-button label="Crear" styleClass="w-full" type="submit" [loading]="loading" iconPos="right"></p-button>
      </form>
    </p-dialog>
  </div>

  <div class="card flex justify-content-center">
    <p-dialog [(visible)]="viewPedidoVisible" [maximizable]="true" [modal]="true"
      [header]="'Pedido actual de la mesa ' + mesaActual.id" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
      [draggable]="false">
      <p>TODO: ver como mostrar los datos</p>
      <p>Mostrar pedido, mostrar lineas, añadir línea (cocina, barra...)</p>
    </p-dialog>
  </div>
</main>
```

```ts
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
    private validator: ValidationMessagesService,
    private toaster: ToastService
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

  onCreate(): void {
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
        this.toaster.smallToast('success', 'Pedido creado correctamente');
      },
      error: (error: any) => {
        this.loading = false;
        this.submitted = false;
        console.log('error', error)
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
```
