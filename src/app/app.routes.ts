import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/admin/registro/registro.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LineasCocinaComponent } from './pages/lineas-cocina/lineas-cocina.component';
import { LineasBarraComponent } from './pages/lineas-barra/lineas-barra.component';
import { HomeComponent } from './pages/home/home.component';
import { MesasComponent } from './pages/mesas/mesas.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminUsuariosComponent } from './pages/admin/usuarios/admin-usuarios.component';
import { AdminRolesComponent } from './pages/admin/roles/admin-roles.component';
import { AdminCategoriasComponent } from './pages/admin/categorias/admin-categorias.component';
import { AdminProductosComponent } from './pages/admin/productos/admin-productos.component';
import { AdminMesasComponent } from './pages/admin/mesas/admin-mesas.component';
import { AdminStockComponent } from './pages/admin/stock/admin-stock.component';
import { AdminPedidosComponent } from './pages/admin/pedidos/admin-pedidos.component';
import { AdminLineasComponent } from './pages/admin/lineas/admin-lineas.component';
import { AdminFacturasComponent } from './pages/admin/facturas/admin-facturas.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - Restaurant'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión - Restaurant'
  },
  {
    path: 'lineas/cocina',
    component: LineasCocinaComponent,
    title: 'Líneas de cocina - Restaurant'
  },
  {
    path: 'lineas/barra',
    component: LineasBarraComponent,
    title: 'Lineas de barra - Restaurant'
  },
  {
    path: 'mesas',
    component: MesasComponent,
    title: 'Mesas - Restaurant'
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    title: 'Panel de administración - Restaurant',
    children: [
      {
        path: 'registro',
        component: RegistroComponent,
        title: 'Registrar un usuario - Admin'
      },
      {
        path: 'roles',
        component: AdminRolesComponent,
        title: 'Roles - Panel de administración'
      },
      {
        path: 'usuarios',
        component: AdminUsuariosComponent,
        title: 'Usuarios - Panel de administración'
      },
      {
        path: 'categorias',
        component: AdminCategoriasComponent,
        title: 'Categorías - Panel de administración'
      },
      {
        path: 'productos',
        component: AdminProductosComponent,
        title: 'Productos - Panel de administración'
      },
      {
        path: 'stock',
        component: AdminStockComponent,
        title: 'Stock - Panel de administración '
      },
      {
        path: 'mesas',
        component: AdminMesasComponent,
        title: 'Mesas - Panel de administración'
      },
      {
        path: 'pedidos',
        component: AdminPedidosComponent,
        title: 'Pedidos - Panel de administración'
      },
      {
        path: 'lineas',
        component: AdminLineasComponent,
        title: 'Lineas - Panel de administración'
      },
      {
        path: 'facturas',
        component: AdminFacturasComponent,
        title: 'Facturas - Panel de administración'
      }
    ]
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'Página no encontrada - Restaurant'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];