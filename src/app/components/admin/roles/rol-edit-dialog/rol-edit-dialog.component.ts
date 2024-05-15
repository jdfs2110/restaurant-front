import { ToastService } from '@/app/lib/toast.service';
import { RolService } from '@/app/services/rol.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Response } from '@/app/types/Response';
import { Rol } from '@/app/types/Rol';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorPComponent } from "../../../error-p/error-p.component";

@Component({
  selector: 'app-rol-edit-dialog',
  standalone: true,
  templateUrl: './rol-edit-dialog.component.html',
  styleUrl: './rol-edit-dialog.component.css',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent
  ]
})
export class RolEditDialogComponent implements OnInit {
  @Input({ required: true }) rol: Rol;
  @Output() onUpdate = new EventEmitter<Rol>

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

  constructor(
    private rolService: RolService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService
  ) { }

  showEditDialog(): void {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.rolForm.setValue({
      nombre: this.rol.nombre
    })
  }

  getNombreErrors() {
    const nombre = this.rolForm.controls.nombre;

    if (nombre.hasError('required')) return this.validationService.requiredMessage();

    if (nombre.hasError('minlength')) return this.validationService.minLength(2);

    if (nombre.hasError('maxlength')) return this.validationService.maxLength(30);

    return '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar el rol ${this.rol.nombre}?`,
      header: 'Editar rol',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { this.onEdit() }
    })
  }

  onEdit() {
    const formValue = this.rolForm.value;
    this.submitted = true;
    this.isLoading = true;

    if (this.rolForm.invalid) {
      this.isLoading = false;
      return;
    }

    const edited: Rol = {
      id: this.rol.id,
      nombre: formValue.nombre ?? this.rol.nombre
    }

    this.rolService.update(edited, this.rol.id).subscribe({
      next: (response: Response<Rol>) => {
        const { data, message } = response;
        this.onUpdate.emit(data);
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
