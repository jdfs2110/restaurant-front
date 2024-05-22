import { ToastService } from '@/app/lib/toast.service';
import { UserService } from '@/app/services/user.service';
import { UserSignalService } from '@/app/services/user.signal.service';
import { Response } from '@/app/types/Response';
import { User } from '@/app/types/User';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { AdminUserEditDialogComponent } from '../../../components/admin/usuarios/user-edit-dialog/user-edit-dialog.component';
import { Rol } from '@/app/types/Rol';
import { RolService } from '@/app/services/rol.service';
import { UserEditPasswordComponent } from '../../../components/admin/usuarios/user-edit-password/user-edit-password.component';
@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
  imports: [
    TableModule,
    CommonModule,
    ToolbarModule,
    ButtonModule,
    RouterLink,
    ConfirmDialogModule,
    AutoCompleteModule,
    AdminUserEditDialogComponent,
    UserEditPasswordComponent,
  ],
})
export class AdminUsuariosComponent implements OnInit {
  protected totalUsers: number;
  protected paginationLimit: number = 1;
  protected users: User[] = [];
  protected roles: Rol[];
  protected loading: boolean = false;
  protected buttonLoading: boolean = false;
  protected first = 0;

  protected filteredUsers: any[] = [];

  constructor(
    private userService: UserService,
    private userSignal: UserSignalService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
    private rolService: RolService,
  ) {}

  get userId(): number {
    return this.userSignal.user().id;
  }

  get rolId(): number {
    return this.userSignal.user().id_rol;
  }

  ngOnInit(): void {
    this.loading = true;
    this.rolService.findAll().subscribe({
      next: (response: Response<Rol[]>) => {
        const { data } = response;
        this.roles = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    this.userService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalUsers = data;
        this.paginationLimit = Number(message);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  fetchUsers(page: number) {
    this.userService.findAll(page).subscribe({
      next: (response: Response<User[]>) => {
        const { data } = response;

        this.users = data;
        this.loading = false;
        this.buttonLoading = false;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadUsers(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.fetchUsers(page);
  }

  showDialog(event: Event, user: User) {
    if (user.id === this.userId) {
      this.toaster.smallToast('error', 'No te puedes eliminar a ti mismo.');
      return;
    }

    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar el usuario?',
      header: 'Eliminación de usuario',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteUser(user);
      },
    });
  }

  deleteUser(user: User) {
    const pos = this.users.indexOf(user);
    this.users = this.users.filter((u: User) => {
      return u.id !== user.id;
    });
    this.userService.delete(user.id).subscribe({
      next: (response: Response<User>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        this.users.splice(pos, 0, user);
        this.toaster.smallToast('error', 'Error al eliminar el usuario');
      },
    });
  }

  filterUser(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query === '') {
      this.filteredUsers = [];
      return;
    }

    this.userService.findUsersWithSimilarName(query).subscribe({
      next: (response: Response<User[]>) => {
        console.log(response);
        const { data } = response;
        this.filteredUsers = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.users = [event.value];
    this.totalUsers = 1;
  }

  refreshTable() {
    this.buttonLoading = true;
    this.first = 0;
    this.fetchUsers(1);
    this.userService.getPages().subscribe({
      next: (response: Response<number>) => {
        const { data, message } = response;
        this.totalUsers = data;
        this.paginationLimit = Number(message);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getIconClass() {
    return this.buttonLoading ? 'pi pi-spin pi-sync' : 'pi pi-sync';
  }

  updateUser(user: User) {
    this.users = this.users.map((u: User) => {
      if (u.id === user.id) {
        return user;
      }

      return u;
    });
  }

  private router: Router = inject(Router);
  register() {
    if (this.rolId === 4) {
      this.router.navigate(['/admin/registro']);
    }
  }

  promptTokenRemoval(event: Event, user: User) {
    if (user.id === this.userId) {
      this.toaster.smallToast(
        'error',
        'No te puedes revocar los tokens a ti mismo.',
      );
      return;
    }

    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea cerrar todas las sesiones al usuario ${user.name}?`,
      header: 'Cerrar sesiones',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.revokeTokens(user);
      },
    });
  }

  revokeTokens(user: User) {
    this.userService.revokeTokens(user.id).subscribe({
      next: (response: Response<any>) => {
        const { message } = response;
        this.toaster.smallToast('success', message);
      },
      error: (error: any) => {
        console.log(error);

        this.toaster.smallToast(
          'error',
          'Error al revocar los tokens del usuario.',
        );
      },
    });
  }
}
