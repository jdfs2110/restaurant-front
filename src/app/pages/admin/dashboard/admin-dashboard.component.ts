import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { RouterOutlet } from '@angular/router';
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
  ) {}

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

  ngOnInit(): void {
    this.adminService.checkIfAdmin();
    this.menubarItems = [
      {
        label: 'Cerrar pestaña',
        icon: 'pi pi-times',
        command: () => {
          window.close();
        },
      },
    ];
    this.items = [
      {
        label: 'Todos los usuarios',
        icon: '/assets/images/users-black.png',
        command: () => {
          this.closeAll();
          this.usersVisible = true;
          this.usersFetched = true;
        },
      },
      {
        label: 'Nuevo usuario',
        icon: '/assets/images/registro-black.png',
        command: () => {
          this.closeAll();
          this.registroVisible = true;
          this.registroFetched = true;
        },
      },
      {
        label: 'Roles',
        icon: '/assets/images/roles-black.png',
        command: () => {
          this.closeAll();
          this.rolesVisible = true;
          this.rolesFetched = true;
        },
      },
      {
        label: 'Productos',
        icon: '/assets/images/productos-black.png',
        command: () => {
          this.closeAll();
          this.productosVisible = true;
          this.productosFetched = true;
        },
      },
      {
        label: 'Categorías',
        icon: '/assets/images/categorias-black.png',
        command: () => {
          this.closeAll();
          this.categoriasVisible = true;
          this.categoriasFetched = true;
        },
      },
      {
        label: 'Mesas',
        icon: '/assets/images/mesas-black.png',
        command: () => {
          this.closeAll();
          this.mesasVisible = true;
          this.mesasFetched = true;
        },
      },
      {
        label: 'Pedidos',
        icon: '/assets/images/pedidos-black.png',
        command: () => {
          this.closeAll();
          this.pedidosVisible = true;
          this.pedidosFetched = true;
        },
      },
      {
        label: 'Facturas',
        icon: '/assets/images/facturas-black.png',
        command: () => {
          this.closeAll();
          this.facturasVisible = true;
          this.facturasFetched = true;
        },
      },
    ];
  }
}
