import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PrimeNGConfig } from 'primeng/api';
import json from '@/assets/i18n/es.json'

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'restaurant-front';

  constructor(private config: PrimeNGConfig) { }

  ngOnInit(): void {
    this.config.setTranslation(json)
  }
}
