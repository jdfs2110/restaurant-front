import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import es from '@/assets/i18n/es.json'
import { ToastModule } from 'primeng/toast';
import { Location } from '@angular/common';
import { InitializeService } from './lib/initialize.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    private primeConfig: PrimeNGConfig,
    private initializer: InitializeService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.primeConfig.setTranslation(es);
    this.primeConfig.ripple = true;
    const redirectTo = this.location.path() === '' ? '/' : this.location.path();
    this.initializer.start(redirectTo);
  }
}
