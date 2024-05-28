import { AuthService } from '@/app/services/auth.service';
import { LoginForm } from '@/app/types/LoginForm';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoggedUserResponse } from '@/app/types/LoggedUserResponse';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { UserSignalService } from '@/app/services/user.signal.service';
import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { ToastService } from '@/app/lib/toast.service';
import { PasswordModule } from 'primeng/password';
import { User } from '@/app/types/User';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorPComponent,
    PasswordModule,
  ],
})
export class LoginComponent implements OnInit {
  protected submitted: boolean = false;
  protected loginError: boolean = false;
  protected errorMessage: string = '';
  protected loading: boolean = false;

  ngOnInit(): void {
    if (this.userSignal.user().id) {
      this.redirect(this.userSignal.user());
    }
  }

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.maxLength(40),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private validationService: ValidationMessagesService,
    private userSignal: UserSignalService,
    private toaster: ToastService,
  ) {}

  getLoginError(): string {
    return this.errorMessage;
  }

  setLoginError(message: string): void {
    this.errorMessage = message;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.loginError = false;

    const form = this.loginForm.value;
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    const loginForm: LoginForm = {
      email: form.email ?? '',
      password: form.password ?? '',
    };

    this.authService.login(loginForm).subscribe({
      next: (response: LoggedUserResponse) => {
        const { data, token } = response;
        if (data.id_rol === 6) {
          this.toaster.detailedToast(
            'error',
            'Usuario bloqueado',
            'No puedes entrar a la aplicación.',
          );
          this.loading = false;
          this.submitted = false;
          return;
        }
        this.authService.setToken(token);
        this.userSignal.updateUser(data);
        this.redirect(data);
      },
      error: (error) => {
        this.loading = false;
        this.setLoginError('Correo o contraseña incorrectos.');
        this.submitted = false;
        this.loginError = true;
      },
    });
  }

  getEmailErrors(): string {
    if (this.loginForm.controls.email.hasError('required'))
      return this.validationService.requiredMessage();

    if (this.loginForm.controls.email.hasError('email'))
      return 'El email no es válido.';

    return '';
  }

  getPasswordErrors(): string {
    if (this.loginForm.controls.password.hasError('required'))
      return this.validationService.requiredMessage();

    if (this.loginForm.controls.password.hasError('maxlength'))
      return this.validationService.maxLength(40);

    return '';
  }

  redirect(user: User): void {
    if (user.id_rol === 4) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  mark(): void {
    this.loginError = false;
  }
}
