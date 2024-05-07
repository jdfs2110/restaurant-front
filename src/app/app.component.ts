import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import es from '@/assets/i18n/es.json'
import { CookieService } from 'ngx-cookie-service';
import { UserSignalService } from './services/user.signal.service';
import { User } from './types/User';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'restaurant-front';
  user: User | null = null;

  constructor(
    private config: PrimeNGConfig,
    private cookieService: CookieService,
    private router: Router,
    private userSignal: UserSignalService
  ) { }

  ngOnInit(): void {
    this.config.setTranslation(es);
    this.config.ripple = true;
    this.user = this.getCookie();
    this.userSignal.updateUser(this.user || ({} as User))
  }

  getCookie() {
    const cookie = this.cookieService.get('user');

    if (cookie) {
      return JSON.parse(cookie)
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
