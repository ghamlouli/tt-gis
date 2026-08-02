import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

const REQUEST_TIMEOUT_MS = 9000;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loading = signal(false);
  errorMessage = signal('');

  login = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const prefilledLogin = this.route.snapshot.queryParamMap.get('login');
    if (prefilledLogin) {
      this.login = prefilledLogin;
    }
  }

  goToTtSpace(): void {
    this.router.navigate(['/login-tt']);
  }

  goToVisitorSpace(): void {
    this.router.navigate(['/visiteur-form']);
  }

  submit(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.loginAndRedirect(this.login, this.password).subscribe({
      next: result => {
        this.loading.set(false);
        if (!result.success) {
          this.errorMessage.set((result as { success: false; message: string }).message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Mot de passe incorrecte, réessayer');
      }
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password'], { queryParams: { login: this.login } });
  }
}
