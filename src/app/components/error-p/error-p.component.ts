import { Component } from '@angular/core';

@Component({
  selector: 'error-p',
  standalone: true,
  imports: [],
  template: `
    <p class="text-red-600"><ng-content></ng-content></p>
  `,
  styles: ``
})
export class ErrorPComponent {

}
