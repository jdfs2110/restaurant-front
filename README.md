# Restaurant front

## TODO

### Frontend

* File uploading (foto categoría, producto)
* que la cantidad de stock no pueda ser negativa al añadir/editar la línea del producto
* cuando el stock de un producto llega a 0 se inhabilita
* todo 😭 :D :D :D

## Para cuando implemente pusher

```ts
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  
  constructor(
    private pusher: PusherService,
    private pedidoService: PedidoService,
    privte audioService: AudioService,
  ) { }

  ngOnInit(): void {
    const channel = this.pusher.listenTo('pedido-created');
    
    channel.bind('pedido-created', (data: any) => {
      const { pedido } = data;
      console.log('nuevo pedido:', pedido);

      this.pedidos = [...this.pedidos, pedido];
    });
  }
}
```

### Usuarios y Tokens

Utilizar signals para los tokens y los usuarios??

#### Mini esquema de navegación

2 dashboards distintos [cocina, mesero] ¿?

dashboard cocina

* Pedidos
* Productos
* Lineas

dashboard mesero

* Stock
* Productos
* Mesas > pedidos
* Mesas > new pedido
* Lineas > new linea
* Pedidos > new pedido
* Pedidos > pedido > lineas
* Facturas (generar factura)

admin panel (absolutamente todo 😲😲)

* Usuarios > info, registrar usuario, bloquear
