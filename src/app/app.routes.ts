import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/admin/registro/registro.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LineasCocinaComponent } from './pages/lineas-cocina/lineas-cocina.component';
import { LineasBarraComponent } from './pages/lineas-barra/lineas-barra.component';
import { HomeComponent } from './pages/home/home.component';

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
    path: 'admin/registro',
    component: RegistroComponent,
    title: 'Registrar un usuario - Admin'
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