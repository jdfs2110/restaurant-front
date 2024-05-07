import { Component } from '@angular/core';
import { LineasComponent } from '../../components/lineas/lineas.component';

@Component({
  selector: 'app-lineas-cocina',
  standalone: true,
  imports: [
    LineasComponent
  ],
  template: `
  <app-lineas channel="lineas-cocina"></app-lineas>
  `
})
export class LineasCocinaComponent {

}
