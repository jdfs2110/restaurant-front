import { UserSignalService } from '@/app/services/user.signal.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TabViewModule } from 'primeng/tabview';
import { ChangeUserPassword, User } from '@/app/types/User';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { UserService } from '@/app/services/user.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@/app/lib/toast.service';
import { ErrorPComponent } from '../../components/error-p/error-p.component';
import { ButtonModule } from 'primeng/button';
import { Response } from '@/app/types/Response';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RepeatPasswordValidator } from '@/app/lib/RepeatPasswordValidator';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  imports: [
    HeaderComponent,
    TabViewModule,
    ReactiveFormsModule,
    InputTextModule,
    ErrorPComponent,
    ButtonModule,
  ],
})
export class PerfilComponent implements OnInit {
  protected user: User;
  protected perfilLoading: boolean = false;
  protected perfilSubmitted: boolean = false;

  protected passwordLoading: boolean = false;
  protected passwordSubmitted: boolean = false;

  constructor(
    private userSignal: UserSignalService,
    private validationService: ValidationMessagesService,
    private userService: UserService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  protected userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  protected passwordGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
  });

  ngOnInit(): void {
    this.user = this.userSignal.user();
    this.userForm.setValue({
      name: this.user.name,
      email: this.user.email,
    });
    this.passwordGroup.reset();
    this.passwordGroup.validator = RepeatPasswordValidator.repeatPassword();
    console.log(this.user);
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

  getPasswordErrors() {
    const password = this.passwordGroup.controls['password'];

    if (password.hasError('required'))
      return this.validationService.requiredMessage();

    if (password.hasError('maxlength'))
      return this.validationService.maxLength(40);

    return '';
  }

  getPasswordConfirmationErrors() {
    const passwordConfirmation =
      this.passwordGroup.controls['password_confirmation'];

    if (passwordConfirmation.hasError('required'))
      return 'Debes repetir la contraseña';

    if (passwordConfirmation.hasError('notEquivalent'))
      return 'Las contraseñas no coinciden.';

    return '';
  }

  onEdit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea actualizar el perfil?`,
      header: 'Actualizar perfil',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.edit();
      },
    });
  }

  edit() {
    const formValue = this.userForm.value;
    this.perfilSubmitted = true;
    this.perfilLoading = true;

    if (this.userForm.invalid) {
      this.perfilLoading = false;
      return;
    }

    const user: User = {
      id: this.user.id,
      name: formValue.name ?? this.user.name,
      email: formValue.email ?? this.user.email,
      estado: this.user.estado,
      fecha_ingreso: this.user.fecha_ingreso,
      id_rol: this.user.id_rol,
      rol: this.user.rol,
    };

    this.userService.update(user, this.user.id).subscribe({
      next: (response: Response<User>) => {
        const { data, message } = response;
        console.log(response);
        this.userSignal.updateUser(data);
        this.perfilLoading = false;
        this.perfilSubmitted = false;
        this.toaster.smallToast('success', 'Perfil actualizado correctamente.');
      },
      error: (error: any) => {
        this.perfilLoading = false;
        console.log(error);
        this.toaster.smallToast('error', 'Error al actualizar el perfil');
        this.userForm.setValue({
          name: this.user.name,
          email: this.user.email,
        });
      },
    });
  }

  onChangePassword(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea cambiar la contraseña?`,
      header: 'Cambiar contraseña',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.changePassword();
      },
    });
  }

  changePassword() {
    const formValue = this.passwordGroup.value;
    this.passwordSubmitted = true;
    this.passwordLoading = true;

    if (this.passwordGroup.invalid) {
      this.passwordLoading = false;
      return;
    }

    const password: ChangeUserPassword = {
      password: formValue.password ?? '',
      password_confirmation: formValue.password_confirmation ?? '',
    };

    this.userService.changePassword(password, this.user.id).subscribe({
      next: (response: Response<User>) => {
        const { data, message } = response;
        this.toaster.smallToast('success', message);
        this.passwordLoading = false;
        this.passwordSubmitted = false;
      },
      error: (error: any) => {
        this.passwordLoading = false;
        console.log(error);
        if (error.error.error) {
          this.toaster.smallToast('error', error.error.error);
        } else {
          this.toaster.smallToast('error', 'Error al cambiar la contraseña.');
        }
      },
    });
  }
}
