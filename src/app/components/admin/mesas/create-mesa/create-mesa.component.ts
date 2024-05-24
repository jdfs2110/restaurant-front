import { Mesa } from '@/app/types/Mesa';
import { Component, EventEmitter, Output } from '@angular/core';
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
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { MesaService } from '@/app/services/mesa.service';
import { ToastService } from '@/app/lib/toast.service';
import { Response } from '@/app/types/Response';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-create-mesa',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    ErrorPComponent,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
  ],
  templateUrl: './create-mesa.component.html',
  styleUrl: './create-mesa.component.css',
})
export class CreateMesaComponent {
  @Output() newMesa = new EventEmitter<Mesa>();
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
    capacidad_maxima: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(20),
    ]),
    estado: new FormControl(null, [Validators.required]),
  });

  showDialog() {
    this.isVisible = true;
  }

  refresh() {
    this.mesaForm.reset();
    this.submitted = false;
    this.isLoading = false;
  }

  constructor(
    private validationService: ValidationMessagesService,
    private mesaService: MesaService,
    private toaster: ToastService,
  ) {}

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

  create() {
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

    this.mesaService.create(form).subscribe({
      next: (response: Response<Mesa>) => {
        const { data, message } = response;
        this.newMesa.emit(data);
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.submitted = false;
        this.isVisible = false;
      },
      error: (error: any) => {
        console.log(error);

        if (error.error.error) {
          this.toaster.smallToast('error', error.error.error);
        } else {
          this.toaster.smallToast('error', 'Error al crear la mesa.');
        }
      },
    });
  }
}

type Estado = {
  nombre: string;
  valor: number;
};
