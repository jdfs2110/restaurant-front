export type User = {
  id: number;
  name: string;
  email: string;
  estado: boolean;
  fecha_ingreso: Date;
  id_rol: number;
  rol: string;
}

export type AdminChangeUserPassword = {
  password: string;
  password_confirmation: string;
}