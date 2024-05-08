import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
  <main class="flex justify-content-center align-items-center min-h-screen ">
    <img src="/assets/404.jpeg" alt="404 - not found" class="border-round border-white">  
  </main>
  `,
  styles: `
  main {
    background: #0E0E0E;
  }
  `
})
export class NotFoundComponent {

}
