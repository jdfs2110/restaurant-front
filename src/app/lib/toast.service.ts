import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private messageService: MessageService
  ) { }

  smallToast(severity: string, message: string) {
    this.messageService.add({
      severity: severity,
      summary: message,
    });
  }

  detailedToast(severity: string, message: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: message,
      detail: detail
    });
  }

  longerDetailedToast(severity: string, message: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: message,
      detail: detail,
      life: 10000
    })
  }
} 