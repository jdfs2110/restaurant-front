import { RepeatPasswordValidator } from '@/app/lib/RepeatPasswordValidator';
import { ToastService } from '@/app/lib/toast.service';
import { UserService } from '@/app/services/user.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { ChangeUserPassword, User } from '@/app/types/User';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ErrorPComponent } from '../../../error-p/error-p.component';
import { InputTextModule } from 'primeng/inputtext';
import { Response } from '@/app/types/Response';
import { UserSignalService } from '@/app/services/user.signal.service';

@Component({
  selector: 'app-user-edit-password',
  standalone: true,
  templateUrl: './user-edit-password.component.html',
  styleUrl: './user-edit-password.component.css',
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    ErrorPComponent,
    InputTextModule,
  ],
})
export class UserEditPasswordComponent implements OnInit {
  @Input({ required: true }) user: User;
  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected passwordGroup: FormGroup;

  showDialog() {
    this.isVisible = true;
  }

  constructor(
    private userService: UserService,
    private userSignal: UserSignalService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService,
  ) {}

  get rolId(): number {
    return this.userSignal.user().id_rol;
  }

  ngOnInit(): void {
    this.passwordGroup = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40),
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40),
      ]),
    });

    this.passwordGroup.validator = RepeatPasswordValidator.repeatPassword();
  }

  refresh() {
    this.passwordGroup.reset();
    this.submitted = false;
    this.isLoading = false;
  }

  getPasswordErrors() {
    const password = this.passwordGroup.controls['password'];

    if (password.hasError('required'))
      return this.validationService.requiredMessage();

    if (password.hasError('minlength'))
      return this.validationService.minLength(6);

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

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea cambiar la contraseña al usuario ${this.user.name}?`,
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
    this.submitted = true;
    this.isLoading = true;

    if (this.passwordGroup.invalid) {
      this.isLoading = false;
      return;
    }

    const password: ChangeUserPassword = {
      password: formValue['password'] ?? '',
      password_confirmation: formValue['password_confirmation'] ?? '',
    };

    this.userService.changePassword(password, this.user.id).subscribe({
      next: (response: Response<User>) => {
        const { data, message } = response;
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
          this.toaster.smallToast('error', 'Error al cambiar la contraseña.');
        }
      },
    });
  }
}
