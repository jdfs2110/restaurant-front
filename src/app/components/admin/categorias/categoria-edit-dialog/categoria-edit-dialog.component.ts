import { ErrorPComponent } from "@/app/components/error-p/error-p.component";
import { ToastService } from "@/app/lib/toast.service";
import { CategoriaService } from "@/app/services/categoria.service";
import { ValidationMessagesService } from "@/app/services/validation-messages.service";
import { Categoria } from "@/app/types/Categoria";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ImageModule } from "primeng/image";
import { InputTextModule } from "primeng/inputtext";
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
    ImageModule
  ]
})
export class CategoriaEditDialogComponent implements OnInit {
  @Input({ required: true }) category: Categoria;
  @Output() onUpdate = new EventEmitter<Categoria>;

  protected isVisible: boolean = false;
  protected isLoading: boolean = false;
  protected submitted: boolean = false;

  protected categoriaForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    foto: new FormControl(null, [Validators.required])
  })
  protected formdata = new FormData();

  constructor(
    private categoriaService: CategoriaService,
    private validationService: ValidationMessagesService,
    private toaster: ToastService,
    private confirmer: ConfirmationService
  ) { }

  showEditDialog() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.categoriaForm.controls.nombre.setValue(this.category.nombre);
  }

  getNombreErrors() {
    const nombre = this.categoriaForm.controls.nombre;

    if (nombre.hasError('required')) return this.validationService.requiredMessage();

    if (nombre.hasError('maxlength')) return this.validationService.maxLength(40);

    return '';
  }

  getFotoErrors() {
    if (this.categoriaForm.controls.foto.hasError('required')) return this.validationService.requiredMessage();

    return '';
  }

  onSubmit(event: Event) {
    this.confirmer.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea editar la categoría ${this.category.nombre}?`,
      header: 'Editar categoría',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => { console.log('accepted') }
    })
  }

  onEdit() {
    this.submitted = true;
    this.isLoading = true;

  }

  onSelectFile(event: any) {
    // TODO
  }
}