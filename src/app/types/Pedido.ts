export type Pedido = {
  id: number;
  fecha: Date;
  estado: string | number;
  estado_numero: number;
  precio: number;
  numero_comensales: number;
  id_mesa: number;
  id_usuario: number;
};
