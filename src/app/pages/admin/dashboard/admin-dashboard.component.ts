import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AdminService } from '../admin.service';
import { Location } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AdminUsuariosComponent } from '../usuarios/admin-usuarios.component';
import { RegistroComponent } from '../registro/registro.component';
import { AdminRolesComponent } from '../roles/admin-roles.component';
import { AdminProductosComponent } from '../productos/admin-productos.component';
import { MenubarModule } from 'primeng/menubar';
import { AdminCategoriasComponent } from '../categorias/admin-categorias.component';
import { AdminMesasComponent } from '../mesas/admin-mesas.component';
import { AdminPedidosComponent } from '../pedidos/admin-pedidos.component';
import { AdminFacturasComponent } from '../facturas/admin-facturas.component';
import { AuthService } from '@/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UserSignalService } from '@/app/services/user.signal.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  imports: [
    HeaderComponent,
    RouterOutlet,
    DockModule,
    DialogModule,
    AdminUsuariosComponent,
    RegistroComponent,
    AdminRolesComponent,
    AdminProductosComponent,
    MenubarModule,
    AdminCategoriasComponent,
    AdminMesasComponent,
    AdminPedidosComponent,
    AdminFacturasComponent,
  ],
})
export class AdminDashboardComponent implements OnInit {
  protected items: MenuItem[];
  protected menubarItems: MenuItem[];

  protected usersVisible: boolean = false;
  protected usersFetched: boolean = false;

  protected registroVisible: boolean = false;
  protected registroFetched: boolean = false;

  protected rolesVisible: boolean = false;
  protected rolesFetched: boolean = false;

  protected productosVisible: boolean = false;
  protected productosFetched: boolean = false;

  protected categoriasVisible: boolean = false;
  protected categoriasFetched: boolean = false;

  protected mesasVisible: boolean = false;
  protected mesasFetched: boolean = false;

  protected pedidosVisible: boolean = false;
  protected pedidosFetched: boolean = false;

  protected facturasVisible: boolean = false;
  protected facturasFetched: boolean = false;

  constructor(
    private adminService: AdminService,
    protected location: Location,
    private authService: AuthService,
    private cookieService: CookieService,
    private userSignal: UserSignalService,
    private router: Router,
  ) { }

  protected closeAll() {
    this.usersVisible = false;
    this.usersFetched = false;

    this.registroVisible = false;
    this.registroFetched = false;

    this.rolesVisible = false;
    this.rolesFetched = false;

    this.productosVisible = false;
    this.productosFetched = false;

    this.categoriasVisible = false;
    this.categoriasFetched = false;

    this.mesasVisible = false;
    this.mesasFetched = false;

    this.pedidosVisible = false;
    this.pedidosFetched = false;

    this.facturasVisible = false;
    this.facturasFetched = false;
  }

  get name(): string {
    return this.userSignal.user().name;
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'q') {
      this.closeAll();
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 1000 && this.location.path() === '/admin') {
      this.router.navigate(['/admin/usuarios']);
    }

    this.adminService.checkIfAdmin();
    this.menubarItems = [
      {
        label: 'Ventanas',
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
    this.items = [
      {
        label: 'Todos los usuarios',
        tooltipOptions: {
          tooltipLabel: 'Todos los usuarios',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/users.png',
        command: () => {
          this.closeAll();
          this.usersVisible = true;
          this.usersFetched = true;
        },
      },
      {
        label: 'Nuevo usuario',
        tooltipOptions: {
          tooltipLabel: 'Nuevo usuario',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/registro.png',
        command: () => {
          this.closeAll();
          this.registroVisible = true;
          this.registroFetched = true;
        },
      },
      {
        label: 'Roles',
        tooltipOptions: {
          tooltipLabel: 'Roles',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/roles.png',
        command: () => {
          this.closeAll();
          this.rolesVisible = true;
          this.rolesFetched = true;
        },
      },
      {
        label: 'Productos',
        tooltipOptions: {
          tooltipLabel: 'Productos',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/productos.png', // #3AD2C5
        command: () => {
          this.closeAll();
          this.productosVisible = true;
          this.productosFetched = true;
        },
      },
      {
        label: 'Categorías',
        tooltipOptions: {
          tooltipLabel: 'Categorías',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/categorias-bluer.png',
        command: () => {
          this.closeAll();
          this.categoriasVisible = true;
          this.categoriasFetched = true;
        },
      },
      {
        label: 'Mesas',
        tooltipOptions: {
          tooltipLabel: 'Mesas',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/mesas.png',
        command: () => {
          this.closeAll();
          this.mesasVisible = true;
          this.mesasFetched = true;
        },
      },
      {
        label: 'Pedidos',
        tooltipOptions: {
          tooltipLabel: 'Pedidos',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/pedidos.png',
        command: () => {
          this.closeAll();
          this.pedidosVisible = true;
          this.pedidosFetched = true;
        },
      },
      {
        label: 'Facturas',
        tooltipOptions: {
          tooltipLabel: 'Facturas',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 0,
        },
        icon: '/assets/images/facturas.png',
        command: () => {
          this.closeAll();
          this.facturasVisible = true;
          this.facturasFetched = true;
        },
      },
    ];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response: any) => {
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

  openRegister(): void {
    this.registroVisible = true;
    this.registroFetched = true;
  }
}
