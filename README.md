# Restaurant front

## TODO

- [ ] todo 😭
- [ ] CHECK MESAS TODO
- [ ] File uploading (foto categoría, producto)
- [ ] que la cantidad de stock no pueda ser negativa al añadir/editar la línea del producto
- [ ] cuando el stock de un producto llega a 0 se inhabilita
- [ ] que el dropdown de estado de pedido en cocina no salga para cambiar a 'servido'
- [ ] fix padding shit (login & registro)
- [ ] arreglar el cierre de sesión cuando se pone ulr a pelo (ej: /lineas/cocina) y las cookies duplicadas
- [ ] buscar nuevas imagenes para los productos (las actuales son horribles)
- [ ] breadcrumb volver en /admin/registro

### Schizo posting

será que devuelvo el created_at de las lineas para filtrar por fecha en el dashboard de cocina/barra?

devuelvo el estado del pedido con las lineas para deshabilitar la edicion en el panel de administrador si el pedido esta servido?

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

- Usuarios > info, registrar usuario, bloquear

```ts
getFotoErrors() {
    if (this.categoriaForm.controls.foto.hasError('required')) return this.validationService.requiredMessage();

    return '';
  }
```
