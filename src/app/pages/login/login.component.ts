import { AuthService } from '@/app/services/auth.service';
import { UserService } from '@/app/services/user.service';
import { LoginForm } from '@/app/types/LoginForm';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ErrorResponse } from '@/app/types/ErrorResponse';
import { LoggedUserResponse } from '@/app/types/LoggedUserResponse';
import { tap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('test@test.com', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(5)
    ])
  })

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private messageService: MessageService) { }

  onLogin() {
    const formValue = this.loginForm.value;

    const loginForm: LoginForm = {
      email: formValue.email ?? '',
      password: formValue.password ?? ''
    };

    this.authService.login(loginForm)
      .pipe(
        tap({
          error(e: ErrorResponse) {
            console.log(e.error);
          }
        })
      )
      .subscribe(
        (response: LoggedUserResponse) => {
          const { data, token } = response;
          console.log(data);
          console.log(token);
          this.showSuccess()
        }
      )
  }

  getEmailErrorMessage() {
    if (this.loginForm.controls.email.hasError('required')) return 'El email no puede estar vacío.';

    if (this.loginForm.controls.email.hasError('email')) return 'El email no es válido.';

    return '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm.controls.password.hasError('required')) return 'La contraseña no puede estar vacía';

    if (this.loginForm.controls.password.hasError('minlength')) return 'La contraseña debe tener al menos 5 caracteres';

    return '';
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content', key: 'login' });
  }
}
