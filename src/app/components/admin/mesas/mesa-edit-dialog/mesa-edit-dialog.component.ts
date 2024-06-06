import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorPComponent } from '../../../error-p/error-p.component';
import { Mesa } from '@/app/types/Mesa';
import { MesaService } from '@/app/services/mesa.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { ToastService } from '@/app/lib/toast.service';
import { ConfirmationService } from 'primeng/api';
import { Response } from '@/app/types/Response';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-mesa-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent,
    DropdownModule,
    InputNumberModule,
  ],
  templateUrl: './mesa-edit-dialog.component.html',
  styleUrl: './mesa-edit-dialog.component.css',
})
export class MesaEditDialogComponent implements OnInit {
  @Input({ required: true }) mesa: Mesa;
  @Output() onUpdate = new EventEmitter<Mesa>();

  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected ESTADOS: Estado[] = [
    {
      nombre: 'Libre',
      valor: 0,
    },
    {
      nombre: 'Ocupada',
      valor: 1,
    },
    {
      nombre: 'Reservada',
      valor: 2,
    },
  ];

  protected mesaForm = new FormGroup({
    capacidad_maxima: new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(20),
    ]),
    estado: new FormControl(0, [Validators.required]),
  });

  constructor(
    private mesaService: MesaService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService,
  ) {}

  showEditDialog(): void {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.mesaForm.setValue({
      capacidad_maxima: this.mesa.capacidad_maxima,
      estado: this.mesa.estado_numero,
    });
  }

  refresh() {
    this.ngOnInit();
    this.isLoading = false;
    this.submitted = false;
  }

  getCapacidadMaximaErrors() {
    const capacidad_maxima = this.mesaForm.controls.capacidad_maxima;

    if (capacidad_maxima.hasError('required'))
      return this.validationService.requiredMessage();

    if (capacidad_maxima.hasError('min')) return 'El mínimo de personas es 1.';

    if (capacidad_maxima.hasError('max')) return 'El máximo de personas es 20.';

    return '';
  }

  getEstadoErrors() {
    const estado = this.mesaForm.controls.estado;

    return estado.hasError('required') ? 'Debes seleccionar un estado.' : '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar la mesa ${this.mesa.id}?`,
      header: 'Editar mesa',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onEdit();
      },
    });
  }

  onEdit() {
    const formValue = this.mesaForm.value;
    this.submitted = true;
    this.isLoading = true;

    if (this.mesaForm.invalid) {
      this.isLoading = false;
      return;
    }

    const form: Mesa = {
      id: 0,
      capacidad_maxima: formValue.capacidad_maxima ?? 1,
      estado: formValue.estado ?? 0,
      estado_numero: 0,
    };

    this.mesaService.update(form, this.mesa.id).subscribe({
      next: (response: Response<Mesa>) => {
        const { data, message } = response;

        this.onUpdate.emit(data);
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.submitted = false;
        this.isVisible = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);

        if (error.error.error) {
          this.toaster.smallToast('error', error.error.error);
        } else {
          this.toaster.smallToast('error', 'Error al editar la mesa.');
        }
      },
    });
  }
}

type Estado = {
  nombre: string;
  valor: number;
};
