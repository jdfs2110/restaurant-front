import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <main
      class="flex justify-content-center align-items-center min-h-screen min-w-screen"
    >
      <img
        src="/assets/images/404.jpeg"
        alt="4 04 - not found"
        class="border-round border-white px-4 md:px-0"
      />
    </main>
  `,
  styles: `
    main {
      background: #0e0e0e;
    }

    img {
      object-fit: cover;
      min-width: 300px;
      user-select: none !important;
    }
  `,
})
export class NotFoundComponent {}
