import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  constructor() { }

  notification(): void {
    const audio = new Audio();
    audio.src = '../../assets/audio/notification.mp3';
    audio.load();
    audio.play();
  }
}