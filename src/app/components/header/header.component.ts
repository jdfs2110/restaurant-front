import { AuthService } from '@/app/services/auth.service';
import { UserSignalService } from '@/app/services/user.signal.service';
import { User } from '@/app/types/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: User = {} as User;

  adminMenuItems: MenuItem[]; // Maybe mega menu or dock if i have extra time
  regularMenuItems: MenuItem[];
  rrhhMenuItems: MenuItem[];

  constructor(
    private userSignal: UserSignalService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.userSignal.user()

    this.adminMenuItems = [
      {
        label: 'Roles',
        icon: 'pi pi-tags',
        routerLink: '/admin/roles'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        routerLink: '/admin/usuarios'
      },
      {
        label: 'Categorías',
        icon: 'pi pi-question', // no se que ponerle
        routerLink: '/admin/categorias'
      },
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Todos los productos',
            icon: 'pi pi-shopping-bag',
            routerLink: '/admin/productos'
          },
          {
            label: 'Stock',
            icon: 'pi pi-question', // no se que ponerle,
            routerLink: '/admin/stock'
          }
        ]
      },
      {
        label: 'Mesas',
        icon: 'pi pi-question', // no se que ponerle
        routerLink: '/admin/mesas'
      },
      {
        label: 'Pedidos',
        icon: 'pi pi-question', // no se que ponerle
        routerLink: '/admin/pedidos'
      },
      {
        label: 'Líneas',
        icon: 'pi pi-list',
        routerLink: '/admin/lineas'
      },
      {
        label: 'Facturas',
        icon: 'pi pi-receipt',
        routerLink: '/admin/facturas'
      }
    ];

    this.rrhhMenuItems = [ // Que carguen el mismo componente y que se compruebe si es rrhh o admin
      {
        label: 'Roles',
        icon: 'pi pi-tags',
        routerLink: '/rrhh/roles'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        routerLink: '/rrhh/usuarios'
      },
    ];

    this.regularMenuItems = [
      {
        label: 'Líneas',
        icon: 'pi pi-list',
        routerLink: `/lineas/${this.user.rol}`
      },
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag'
      }
    ];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response: any) => {
        console.log(response);

        this.userSignal.clearUser()
        this.cookieService.deleteAll();
        this.redirect();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  redirect(): void {
    this.router.navigateByUrl('/login');

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
