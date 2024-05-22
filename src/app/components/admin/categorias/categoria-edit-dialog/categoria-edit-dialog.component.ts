import { ErrorPComponent } from '@/app/components/error-p/error-p.component';
import { ToastService } from '@/app/lib/toast.service';
import { CategoriaService } from '@/app/services/categoria.service';
import { ValidationMessagesService } from '@/app/services/validation-messages.service';
import { Categoria } from '@/app/types/Categoria';
import { Response } from '@/app/types/Response';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import env from '@/app/env.json';
@Component({
  selector: 'app-categoria-edit-dialog',
  standalone: true,
  templateUrl: './categoria-edit-dialog.component.html',
  styleUrl: './categoria-edit-dialog.component.css',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ErrorPComponent,
    ImageModule,
  ],
})
export class CategoriaEditDialogComponent implements OnInit {
  @Input({ required: true }) category: Categoria;
  @Output() onUpdate = new EventEmitter<Categoria>();
  protected inputImage: Blob;
  protected currentImage: string = '';

  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected categoriaForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    foto: new FormControl(null),
  });
  protected formdata = new FormData();

  constructor(
    private categoriaService: CategoriaService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService,
  ) {}

  showEditDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.currentImage = this.category.foto;
    this.categoriaForm.controls.nombre.setValue(this.category.nombre);
  }

  refresh(event: any) {
    this.ngOnInit();
    this.submitted = false;
    this.isLoading = false;
  }

  getNombreErrors() {
    const nombre = this.categoriaForm.controls.nombre;

    if (nombre.hasError('required'))
      return this.validationService.requiredMessage();

    if (nombre.hasError('maxlength'))
      return this.validationService.maxLength(40);

    return '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar la categoría ${this.category.nombre}?`,
      header: 'Editar categoría',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onEdit();
      },
    });
  }

  onEdit() {
    this.submitted = true;
    this.isLoading = true;

    if (this.categoriaForm.invalid) {
      this.isLoading = false;
      return;
    }

    const nombre =
      this.categoriaForm.controls.nombre.value ?? this.category.nombre;
    this.formdata.set('nombre', nombre);

    this.formdata.set('foto', '');

    if (this.inputImage !== undefined) {
      this.formdata.set('foto', this.inputImage);
    }

    this.categoriaService.update(this.formdata, this.category.id).subscribe({
      next: (response: Response<Categoria>) => {
        const { data, message } = response;
        this.onUpdate.emit(data);
        this.toaster.smallToast('success', message);
        this.isLoading = false;
        this.isVisible = false;
        this.submitted = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.error.error) {
          this.toaster.detailedToast(
            'error',
            'Error al actualizar la categoría',
            error.error.error,
          );
        } else {
          this.toaster.smallToast('error', 'Error al actualizar la categoría');
        }
      },
    });
  }

  onSelectFile(event: any) {
    this.inputImage = event.target.files[0];
    if (this.inputImage !== null)
      this.currentImage = URL.createObjectURL(event.target.files[0]);
  }

  setPlaceholder(event: any) {
    event.target.src = env.PLACEHOLDER_PHOTO;
  }
}
