import { ToastService } from '@/app/lib/toast.service';
import { RolService } from '@/app/services/rol.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ErrorPComponent } from "../../../error-p/error-p.component";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-rol',
  standalone: true,
  templateUrl: './create-rol.component.html',
  styleUrl: './create-rol.component.css',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    ErrorPComponent,
    DialogModule,
    InputTextModule
  ]
})
export class CreateRolComponent {
  @Output() newRol = new EventEmitter<Rol>
  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected rolForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ])
  })


  showDialog() {
    this.isVisible = true;
  }

  refresh(event: any) {
    this.rolForm.reset();
    this.submitted = false;
    this.isLoading = false;
  }

  constructor(
    private validationService: ValidationMessagesService,
    private rolService: RolService,
    private toaster: ToastService,
  ) { }

  getNombreErrors() {
    const nombre = this.rolForm.controls.nombre;

    if (nombre.hasError('required')) return this.validationService.requiredMessage();

    if (nombre.hasError('minlength')) return this.validationService.minLength(2);

    if (nombre.hasError('maxlength')) return this.validationService.maxLength(30);

    return '';
  }

  create() {
    const formValue = this.rolForm.value;
    this.submitted = true;
    this.isLoading = true;

    if (this.rolForm.invalid) {
      this.isLoading = false;
      return;
    }

    const newRol: Rol = {
      id: 0,
      nombre: formValue.nombre ?? ''
    }

    this.rolService.create(newRol).subscribe({
      next: (response: Response<Rol>) => {
        const { data, message } = response;
        this.newRol.emit(data);
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.isVisible = false;
      },
      error: (error: any) => {
        console.log(error);

        if (error.error.error) {
          this.toaster.smallToast('error', error.error.error)
        } else {
          this.toaster.smallToast('error', 'Error al actualizar el rol.')
        }
      }
    })
  }
}
