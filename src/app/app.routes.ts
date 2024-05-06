import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LineasComponent } from './pages/lineas/lineas.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
// TODO: quitar registro o ver que hacer con el
export const routes: Routes = [
  // {
  //   path: '',
  //   component: TODO
  // },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'lineas',
    component: LineasComponent
  },
  {
    path: 'admin/registro',
    component: RegistroComponent
  },
  // {
  //   path: '404',
  //   component: NotFoundComponent,
  //   title: 'Página no encontrada'
  // },
  // {
  //   path: '**',
  //   redirectTo: '404'
  // }
];