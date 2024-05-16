export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  foto: string;
  id_categoria: number;
  categoria: string;
  cantidad: number;
}

export type stockQuantity = {
  cantidad: number;
}