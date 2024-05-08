import { AuthService } from '@/app/services/auth.service';
import { LoginForm } from '@/app/types/LoginForm';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoggedUserResponse } from '@/app/types/LoggedUserResponse';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '@/app/types/User';
import { UserSignalService } from '@/app/services/user.signal.service';
import { ErrorPComponent } from "@/app/components/error-p/error-p.component";
import { ToastService } from '@/app/lib/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorPComponent
  ]
})
export class LoginComponent implements OnInit {
  protected submitted: boolean = false;
  protected loginError: boolean = false;
  protected errorMessage: string = '';

  ngOnInit(): void {
    if (this.userSignal.user().id) {
      this.redirect()
    }
  }

  loginForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(40)
    ])
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private validationService: ValidationMessagesService,
    private cookieService: CookieService,
    private userSignal: UserSignalService,
    private toaster: ToastService
  ) { }

  getLoginError(): string {
    return this.errorMessage;
  }

  setLoginError(message: string): void {
    this.errorMessage = message;
  }

  onSubmit() {
    this.submitted = true;
    const form = this.loginForm.value;
    if (this.loginForm.invalid) {
      return;
    }

    const loginForm: LoginForm = {
      email: form.email ?? '',
      password: form.password ?? ''
    };

    this.authService.login(loginForm)
      .subscribe({
        next: (response: LoggedUserResponse) => {
          const { data, token } = response;
          this.setCookie(data)
          this.authService.setToken(token);
          this.userSignal.updateUser(data);
          this.redirect();
        },
        error: (error) => {
          console.log(error);
          this.toaster.smallToast('error', 'Error en el login');
          this.setLoginError('Correo o contraseña incorrectos.');
          this.loginError = true;
        }
      });
  }

  getEmailErrors(): string {
    if (this.loginForm.controls.email.hasError('required')) return this.validationService.requiredMessage();

    if (this.loginForm.controls.email.hasError('email')) return 'El email no es válido.';

    return '';
  }

  getPasswordErrors(): string {
    if (this.loginForm.controls.password.hasError('required')) return this.validationService.requiredMessage();

    if (this.loginForm.controls.password.hasError('minlength')) return this.validationService.minLength(6);

    if (this.loginForm.controls.password.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  setCookie(user: User): void {
    this.cookieService.set('user', JSON.stringify(user));
  }

  redirect(): void {
    this.router.navigate(['/']);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  mark(): void {
    this.loginError = false;
  }
}
