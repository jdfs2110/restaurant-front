import { RepeatPasswordValidator } from '@/app/lib/RepeatPasswordValidator';
import { ToastService } from '@/app/lib/toast.service';
import { UserService } from '@/app/services/user.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { User } from '@/app/types/User';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorPComponent } from '../../../error-p/error-p.component';
import { UserSignalService } from '@/app/services/user.signal.service';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.css',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ErrorPComponent,
  ],
})
export class AdminUserEditDialogComponent implements OnInit {
  @Input({ required: true }) user: User;
  @Input({ required: true }) roles: Rol[];
  @Output() onUpdate = new EventEmitter<User>();
  protected estados: Estado[] = [
    {
      nombre: 'Alta',
      valor: true,
    },
    {
      nombre: 'Baja',
      valor: false,
    },
  ];
  protected isVisible: boolean = false;
  protected userForm: FormGroup;
  protected submitted = false;
  protected isLoading = false;

  showEditDialog(): void {
    this.isVisible = true;
  }

  protected get userId(): number {
    return this.userSignal.user().id;
  }

  get rolId(): number {
    return this.userSignal.user().id_rol;
  }

  constructor(
    private userSignal: UserSignalService,
    private userService: UserService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl(this.user.name, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      estado: new FormControl(this.user.estado, [Validators.required]),
      id_rol: new FormControl(this.user.id_rol, [Validators.required]),
    });
  }

  getNameErrors() {
    const name = this.userForm.controls['name'];

    if (name.hasError('required'))
      return this.validationService.requiredMessage();

    if (name.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  getEmailErrors() {
    const email = this.userForm.controls['email'];

    if (email.hasError('required'))
      return this.validationService.requiredMessage();

    if (email.hasError('email')) return 'El email no es válido';

    return '';
  }

  getEstadoErrors() {
    const estado = this.userForm.controls['estado'];

    if (estado.hasError('required')) return 'Debes seleccionar un estado.';

    return '';
  }

  getIdRolErrors() {
    const idRol = this.userForm.controls['id_rol'];

    if (idRol.hasError('required')) return 'Debes seleccionar un rol.';

    return '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar al usuario ${this.user.name}?`,
      header: 'Editar usuario',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onEdit();
      },
    });
  }

  onEdit() {
    const formValue = this.userForm.value;
    this.submitted = true;
    this.isLoading = true;

    if (this.userForm.invalid) {
      this.isLoading = false;
      return;
    }

    if (this.user.id === this.userId && formValue['id_rol'] !== 4) {
      this.isVisible = false;
      this.toaster.detailedToast(
        'error',
        'Error de permisos',
        'No te puedes quitar los permisos de administrador.',
      );
      return;
    }

    const user: User = {
      id: this.user.id,
      name: formValue['name'] ?? this.user.name,
      email: formValue['email'] ?? this.user.email,
      estado: formValue['estado'] ?? this.user.estado,
      fecha_ingreso: this.user.fecha_ingreso,
      id_rol: formValue['id_rol'] ?? this.user.id_rol,
      rol: 'este campo no se utiliza en la db',
    };

    this.userService.update(user, this.user.id).subscribe({
      next: (response: Response<User>) => {
        const { data, message } = response;
        console.log(data, message);
        if (this.user.id === this.userId) {
          this.userSignal.updateUser(data);
        }
        this.onUpdate.emit(data);
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.isVisible = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        if (error.error.error) {
          this.toaster.smallToast('error', error.error.error);
        } else {
          this.toaster.smallToast('error', 'Error al actualizar el usuario.');
        }
      },
    });
  }
}

type Estado = {
  nombre: string;
  valor: boolean;
};
