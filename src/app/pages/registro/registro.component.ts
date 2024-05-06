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

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  protected roles: Rol[] = [];
  protected registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(40)
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(40)
    ]),
    id_rol: new FormControl(0, [Validators.required])
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
    return;



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
        },
        (error) => {
          console.log(error);
        }
      )
  }
}
