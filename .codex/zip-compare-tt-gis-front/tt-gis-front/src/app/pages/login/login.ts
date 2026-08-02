import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ROLE_OPTIONS, UserRole } from '../../models/user.model';

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  readonly roleOptions = ROLE_OPTIONS;

  mode: AuthMode = 'signin';
  loading = false;
  errorMessage = '';

  identifier = '';
  password = '';

  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  selectedRole: UserRole = 'CLIENT';
  signUpPassword = '';
  confirmPassword = '';

  constructor(private authService: AuthService) {}

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  submitSignIn(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.loginAndRedirect(this.identifier, this.password).subscribe({
      next: result => {
        this.loading = false;

        if (!result.success) {
          this.errorMessage = result.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Connexion impossible pour le moment.';
      }
    });
  }

  submitSignUp(): void {
    if (this.loading) {
      return;
    }

    if (this.signUpPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signUpAndRedirect({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      role: this.selectedRole,
      password: this.signUpPassword
    }).subscribe({
      next: result => {
        this.loading = false;

        if (!result.success) {
          this.errorMessage = result.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Inscription impossible pour le moment.';
      }
    });
  }
}
