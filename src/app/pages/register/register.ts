import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PROFILS, Profil } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  profils = PROFILS;

  matricule = '';
  nom = '';
  prenom = '';
  profil: Profil | '' = '';
  login = '';
  motDePasse = '';
  confirmMotDePasse = '';

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.loading()) {
      return;
    }

    this.errorMessage.set('');

    if (!/^[0-9]+$/.test(this.matricule)) {
      this.errorMessage.set('Le matricule doit être une suite de chiffres.');
      return;
    }
    if (!this.nom || !this.prenom || !this.profil || !this.login || !this.motDePasse || !this.confirmMotDePasse) {
      this.errorMessage.set('Tous les champs sont obligatoires.');
      return;
    }
    if (/\s/.test(this.login)) {
      this.errorMessage.set('Le login ne doit contenir aucun espace.');
      return;
    }
    if (this.motDePasse !== this.confirmMotDePasse) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);

    this.authService.registerAndRedirectToLogin({
      matricule: this.matricule,
      nom: this.nom,
      prenom: this.prenom,
      profil: this.profil as Profil,
      login: this.login,
      motDePasse: this.motDePasse,
      confirmMotDePasse: this.confirmMotDePasse
    }).subscribe({
      next: result => {
        this.loading.set(false);
        if (!result.success) {
          this.errorMessage.set((result as { success: false; message: string }).message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Création impossible pour le moment.');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
