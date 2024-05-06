import { Component, OnInit } from '@angular/core';
import { UserService } from '@/app/services/user.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { RegisterForm } from '@/app/types/RegisterForm';
import { User } from '@/app/types/User';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button'
import { RolService } from '@/app/services/rol.service';
import { DropdownModule } from 'primeng/dropdown'
import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { ErrorResponse } from '@/app/types/ErrorResponse';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ErrorPComponent
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  protected roles: Rol[] = [];
  protected registerError: boolean = false;
  protected errorMessage: string = '';

  protected registerForm = new FormGroup({
    name: new FormControl('si', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    email: new FormControl('rrhh@jdfs.dev', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(40)
    ]),
    password_confirmation: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(40)
    ]),
    id_rol: new FormControl(3, [Validators.required])
  });

  constructor(
    private validationSevice: ValidationMessagesService,
    private userService: UserService,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.rolService.findAll().subscribe(
      (json: Response<Rol[]>) => {
        const { data } = json;
        this.roles = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getNameErrors() {
    if (this.registerForm.controls.name.hasError('required')) return this.validationSevice.requiredMessage();

    if (this.registerForm.controls.name.hasError('maxlength')) return this.validationSevice.maxLength(40);

    return '';
  }

  getEmailErrors() {
    if (this.registerForm.controls.email.hasError('required')) return this.validationSevice.requiredMessage();

    if (this.registerForm.controls.email.hasError('email')) return 'El email no es válido';

    return '';
  }

  getPasswordErrors() {
    if (this.registerForm.controls.password.hasError('required')) return this.validationSevice.requiredMessage();

    if (this.registerForm.controls.password.hasError('minlength')) return this.validationSevice.minLength(6);

    if (this.registerForm.controls.password.hasError('maxlength')) return this.validationSevice.maxLength(40);

    return '';
  }

  getPasswordConfirmationErrors() {
    if (this.registerForm.controls.password.value !== this.registerForm.controls.password_confirmation.value) return 'Las contraseñas no coinciden.';

    if (this.registerForm.controls.password_confirmation.hasError('required')) return 'Debes repetir la contraseña';

    return '';
  }

  getIdRolErrors() {
    if (this.registerForm.controls.id_rol.hasError('required')) return this.validationSevice.requiredMessage();

    return '';
  }

  onSubmit() {
    const form = this.registerForm.value;
    console.log(form);

    const registerForm: RegisterForm = {
      name: form.name ?? '',
      email: form.email ?? '',
      password: form.password ?? '',
      password_confirmation: form.password_confirmation ?? '',
      id_rol: form.id_rol ?? 6 // 6 = bloqueado
    }

    this.userService.create(registerForm)
      .subscribe(
        (response: Response<User>) => {
          const { data, message } = response;
          console.log(data);
          console.log(message);
          this.registerError = false;
        },
        (e: any) => {
          if (e.error.error.email !== null) {
            this.setError(e.error.error.email);
          } else {
            this.setError('Ha ocurrido un error');
          }
          this.registerError = true;
        }
      )
  }

  setError(message: string) {
    this.errorMessage = message;
  }

  getError() {
    return this.errorMessage;
  }
}
