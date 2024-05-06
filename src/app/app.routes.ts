import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LineasComponent } from './pages/lineas/lineas.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
// TODO: quitar registro
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'lineas',
    component: LineasComponent
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'Página no encontrada'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];