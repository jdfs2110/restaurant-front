import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="flex justify-content-center align-items-center flex-column">
      <p class="text-white text-2xl">Página no encontrada :(</p>
      <a class="text-white text-2xl" routerLink="/home"
        >Click para volver al inicio</a
      >
      <div class="wrapper">
        <img
          src="/assets/images/404.jpeg"
          alt="404 - not found"
          class="border-round border-white"
          routerLink="/home"
          title="Click para volver al inicio"
        />
      </div>
    </main>
  `,
  styles: `
    main {
      background: #0e0e0e;
      width: 100%;
      height: 100dvh;
    }

    a {
      text-decoration: none;
      margin-block: 1rem;
    }

    a:hover {
      text-decoration: underline;
    }

    .wrapper {
      width: 95%;
      max-width: 900px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wrapper img {
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
      user-select: none;
    }

    .wrapper img:hover {
      transform: scale(1.1);
      transition: transform 0.5s ease;
      cursor: pointer;
    }
  `,
})
export class NotFoundComponent {}
