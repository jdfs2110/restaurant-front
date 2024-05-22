import { ToastService } from '@/app/lib/toast.service';
import { CategoriaService } from '@/app/services/categoria.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Categoria } from '@/app/types/Categoria';
import { Response } from '@/app/types/Response';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ErrorPComponent } from '../../../error-p/error-p.component';
import { InputTextModule } from 'primeng/inputtext';
import env from '@/app/env.json';

@Component({
  selector: 'app-create-category',
  standalone: true,
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ImageModule,
    ErrorPComponent,
    InputTextModule,
  ],
})
export class CreateCategoryComponent {
  @Output() onCreate = new EventEmitter();
  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;
  protected fotoError: boolean = false;

  protected inputImage: Blob;
  protected currentImage: string = env.PLACEHOLDER_PHOTO;

  protected categoriaForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    foto: new FormControl(null, [Validators.required]),
  });

  constructor(
    private categoriaService: CategoriaService,
    private validationService: ValidationMessagesService,
    private confirmer: ConfirmationService,
    private toaster: ToastService,
  ) {}

  showDialog() {
    this.isVisible = true;
  }

  refresh(event: any) {
    this.categoriaForm.reset();
    this.submitted = false;
    this.isLoading = false;
    this.currentImage = env.PLACEHOLDER_PHOTO;
  }

  getNombreErrors() {
    const nombre = this.categoriaForm.controls.nombre;

    if (nombre.hasError('required'))
      return this.validationService.requiredMessage();

    if (nombre.hasError('maxlength'))
      return this.validationService.maxLength(40);

    return '';
  }

  getFotoErrors() {
    const foto = this.categoriaForm.controls.foto;

    if (foto.hasError('required')) return 'Debes elegir una foto.';

    return '';
  }

  onSelectFile(event: any) {
    this.inputImage = event.target.files[0];
    if (this.inputImage !== null)
      this.currentImage = URL.createObjectURL(event.target.files[0]);
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea crear la categoría?`,
      header: 'Crear categoría',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.create();
      },
    });
  }

  create() {
    const formdata = new FormData();
    this.submitted = true;
    this.isLoading = true;

    if (this.categoriaForm.invalid) {
      this.isLoading = false;
      return;
    }

    const formValue = this.categoriaForm.value;
    const nombre = formValue.nombre ?? '';

    formdata.set('nombre', nombre);
    formdata.set('foto', this.inputImage);

    this.categoriaService.create(formdata).subscribe({
      next: (response: Response<Categoria>) => {
        const { message } = response;
        this.onCreate.emit();
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.isVisible = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.error.error) {
          this.toaster.detailedToast(
            'error',
            'Error al crear la categoría',
            error.error.error,
          );
        } else {
          this.toaster.smallToast('error', 'Error al crear la categoría');
        }
      },
    });
  }
}
