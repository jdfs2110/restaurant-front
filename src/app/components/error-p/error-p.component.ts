import { Component } from '@angular/core';

@Component({
  selector: 'error-p',
  standalone: true,
  imports: [],
  template: `
    <p class="text-red-600 mb-1"><ng-content></ng-content></p>
  `,
  styles: `
  p {
    margin: 0;
    padding: 0;
  }
  `
})
export class ErrorPComponent {

}
