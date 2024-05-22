import { Component } from '@angular/core';
import { LineasComponent } from '../../components/lineas/lineas.component';

@Component({
  selector: 'app-lineas-barra',
  standalone: true,
  imports: [LineasComponent],
  template: ` <app-lineas channel="lineas-barra"></app-lineas> `,
})
export class LineasBarraComponent {}
