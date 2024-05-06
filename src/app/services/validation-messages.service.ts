import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {

  requiredMessage(): string {
    return 'El campo no puede estar vacío.';
  }

  minLength(length: number): string {
    return `El campo debe tener al menos ${length} caracteres.`;
  }

  maxLength(length: number): string {
    return `El campo no puede tener más de ${length} caracteres.`;
  }
}