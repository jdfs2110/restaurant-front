import { AuthService } from '@/app/services/auth.service';
import { UserSignalService } from '@/app/services/user.signal.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  adminMenuItems: MenuItem[];
  regularMenuItems: MenuItem[];
  meseroMenuItems: MenuItem[];
  rrhhMenuItems: MenuItem[];

  constructor(
    private userSignal: UserSignalService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private confirmer: ConfirmationService,
  ) {}

  protected get name(): string {
    return this.userSignal.user().name;
  }

  protected get idRol(): number {
    return this.userSignal.user().id_rol;
  }

  protected get rol(): string {
    return this.userSignal.user().rol;
  }

  ngOnInit(): void {
    this.adminMenuItems = [
      {
        label: 'Empleados',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            items: [
              {
                label: 'Todos los usuarios',
                icon: 'pi pi-users',
                routerLink: '/admin/usuarios',
              },
              {
                label: 'Nuevo usuario',
                icon: 'pi pi-plus',
                routerLink: '/admin/registro',
              },
            ],
          },
          {
            label: 'Roles',
            icon: 'pi pi-tags',
            routerLink: '/admin/roles',
          },
        ],
      },
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Todos los productos',
            icon: 'pi pi-shopping-bag',
            routerLink: '/admin/productos',
          },
          {
            label: 'Categorías',
            icon: 'pi pi-list',
            routerLink: '/admin/categorias',
          },
        ],
      },
      {
        label: 'Restaurante',
        icon: 'pi pi-shop',
        items: [
          {
            label: 'Mesas',
            icon: 'pi pi-objects-column',
            routerLink: '/admin/mesas',
          },
          {
            label: 'Pedidos',
            icon: 'pi pi-shopping-cart',
            routerLink: '/admin/pedidos',
          },
          {
            label: 'Finanzas',
            icon: 'pi pi-money-bill',
            items: [
              {
                label: 'Facturas',
                icon: 'pi pi-receipt',
                routerLink: '/admin/facturas',
              },
            ],
          },
        ],
      },
      {
        label: 'Ventanas',
        icon: 'pi pi-sitemap',
        items: [
          {
            label: 'Mesas',
            icon: 'pi pi-objects-column',
            routerLink: '/mesas',
          },
          {
            label: 'Líneas de barra',
            icon: 'pi pi-list',
            routerLink: '/lineas/barra',
          },
          {
            label: 'Líneas de cocina',
            icon: 'pi pi-list',
            routerLink: '/lineas/cocina',
          },
          {
            label: 'Productos',
            icon: 'pi pi-shopping-bag',
            routerLink: '/productos',
          },
        ],
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user-edit',
        routerLink: '/perfil',
      },
    ];

    this.rrhhMenuItems = [
      {
        label: 'Empleados',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            routerLink: '/rrhh/usuarios',
          },
          {
            label: 'Roles',
            icon: 'pi pi-tags',
            routerLink: '/rrhh/roles',
          },
        ],
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user-edit',
        routerLink: '/perfil',
      },
    ];

    this.meseroMenuItems = [
      {
        label: 'Mesas',
        icon: 'pi pi-objects-column',
        routerLink: '/mesas',
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user-edit',
        routerLink: '/perfil',
      },
    ];

    this.regularMenuItems = [
      {
        label: 'Líneas',
        icon: 'pi pi-list',
        routerLink: `${this.idRol === 2 ? '/lineas/cocina' : '/lineas/barra'}`,
      },
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        routerLink: '/productos',
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user-edit',
        routerLink: '/perfil',
      },
    ];
  }

  showLogout(event: Event): void {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea cerrar sesión?`,
      header: 'Cerrar sesión',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.logout();
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response: any) => {
        console.log(response);

        this.handleLogout();
      },
      error: (error) => {
        console.log(error);
        this.handleLogout();
      },
    });
  }

  handleLogout(): void {
    this.userSignal.clearUser();
    this.cookieService.deleteAll();
    window.location.reload();
  }

  redirect(): void {
    this.router.navigate(['/login']);
  }
}
