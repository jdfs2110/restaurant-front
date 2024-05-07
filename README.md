# Restaurant front

## TODO

- [ ] File uploading (foto categoría, producto)
- [ ] que la cantidad de stock no pueda ser negativa al añadir/editar la línea del producto
- [ ] cuando el stock de un producto llega a 0 se inhabilita
- [ ] todo 😭
- [ ] que el dropdown de estado de pedido en cocina no salga para cambiar a 'servido'
- [ ] fix padding shit (login & registro)

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

- Usuarios > info, registrar usuario, bloquear

```ts
completarLinea(id: number) {
    this.lineaService.completarLinea(id).subscribe((response: Response<any>) => {
      this.lineas.find((linea: Linea, index: number) => {
        if (linea.id === id) {
          this.lineas.splice(index, 1);

          return true;
        }

        return false;
      });
      console.log(response.message);
    })
  }
```
