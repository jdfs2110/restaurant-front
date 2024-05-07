export type Linea = {
  id: number;
  precio: number;
  cantidad: number;
  id_producto: number;
  producto: string;
  producto_foto: string;
  id_pedido: number;
  tipo: string;
  estado: string | number;
  estado_numero: number;
}