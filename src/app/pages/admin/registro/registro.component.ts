import { Component, OnInit } from '@angular/core';
import { UserService } from '@/app/services/user.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { RegisterForm } from '@/app/types/RegisterForm';
import { User } from '@/app/types/User';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button'
import { RolService } from '@/app/services/rol.service';
import { DropdownModule } from 'primeng/dropdown'
import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { AdminService } from '../admin.service';
import { RepeatPasswordValidator } from '@/app/lib/RepeatPasswordValidator';
import { ToastService } from '@/app/lib/toast.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ErrorPComponent,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  protected registerForm: FormGroup;
  protected passwordGroup: FormGroup;

  protected roles: Rol[] = [];

  protected submitted: boolean = false;
  protected registerError: boolean = false;
  protected errorMessage: string = '';

  constructor(
    private validationService: ValidationMessagesService,
    private userService: UserService,
    private rolService: RolService,
    private adminService: AdminService,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {
    this.passwordGroup = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ])
    })

    this.passwordGroup.validator = RepeatPasswordValidator.repeatPassword();

    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(40)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      passwords: this.passwordGroup,
      id_rol: new FormControl(3, [Validators.required])
    })

    this.adminService.checkIfAdmin();
    this.rolService.findAll().subscribe({
      next: (json: Response<Rol[]>) => {
        const { data } = json;
        this.roles = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getNameErrors() {
    const name = this.registerForm.controls['name'];

    if (name.hasError('required')) return this.validationService.requiredMessage();

    if (name.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  getEmailErrors() {
    const email = this.registerForm.controls['email'];

    if (email.hasError('required')) return this.validationService.requiredMessage();

    if (email.hasError('email')) return 'El email no es válido';

    return '';
  }

  getPasswordErrors() {
    const password = this.passwordGroup.controls['password'];

    if (password.hasError('required')) return this.validationService.requiredMessage();

    if (password.hasError('minlength')) return this.validationService.minLength(6);

    if (password.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  getPasswordConfirmationErrors() {
    const passwordConfirmation = this.passwordGroup.controls['password_confirmation'];

    if (passwordConfirmation.hasError('required')) return 'Debes repetir la contraseña';

    if (passwordConfirmation.hasError('notEquivalent')) return 'Las contraseñas no coinciden.';

    return '';
  }

  getIdRolErrors() {
    const idRol = this.registerForm.controls['id_rol'];

    if (idRol.hasError('required')) return 'Debes seleccionar un rol.';

    return '';
  }

  onSubmit() {
    this.submitted = true;
    const form = this.registerForm.value;

    if (this.registerForm.invalid) {
      return;
    };

    const registerForm: RegisterForm = {
      name: form['name'] ?? '',
      email: form['email'] ?? '',
      password: form['passwords'].password ?? '',
      password_confirmation: form['passwords'].password_confirmation ?? '',
      id_rol: form['id_rol'] ?? 6 // 6 = bloqueado
    }

    console.log(registerForm);

    this.userService.create(registerForm)
      .subscribe({
        next: (response: Response<User>) => {

          const { message } = response;
          this.registerError = false;

          this.toaster.smallToast('success', message);
        },
        error: (e: any) => {
          if (e.error.error.email !== null) {
            this.setError(e.error.error.email);
          } else {
            this.setError('Ha ocurrido un error');
          }
          console.log(e);
          this.registerError = true;
        }
      }
      )
  }

  setError(message: string) {
    this.errorMessage = message;
  }

  getError() {
    return this.errorMessage;
  }

  resetForm() {
    this.submitted = false;
  }
}
