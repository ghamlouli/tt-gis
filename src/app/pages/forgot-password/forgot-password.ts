import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PROFILS, Profil } from '../../models/user.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit {
  profils = PROFILS;

  login = '';
  /** Champ affiché comme dans le formulaire de création de compte,
   *  volontairement laissé vide : le matricule n'est jamais modifié
   *  lors d'une récupération de mot de passe. */
  matricule = '';
  nom = '';
  prenom = '';
  profil: Profil | '' = '';
  motDePasse = '';
  confirmMotDePasse = '';

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const prefilledLogin = this.route.snapshot.queryParamMap.get('login') ?? '';
    this.login = prefilledLogin;

    if (prefilledLogin) {
      this.authService.lookupByLogin(prefilledLogin).subscribe(profile => {
        if (profile) {
          this.matricule = profile.matricule;
          this.nom = profile.nom;
          this.prenom = profile.prenom;
          this.profil = profile.profil as Profil;
        } else {
          this.errorMessage.set('Aucun compte trouvé pour ce login.');
        }
      });
    }
  }

  submit(): void {
    if (this.loading()) {
      return;
    }

    this.errorMessage.set('');

    if (!this.login || !this.nom || !this.prenom || !this.profil || !this.motDePasse || !this.confirmMotDePasse) {
      this.errorMessage.set('Tous les champs sont obligatoires.');
      return;
    }
    if (this.motDePasse !== this.confirmMotDePasse) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);

    this.authService.forgotPasswordAndRedirectToLogin({
      login: this.login,
      matricule: this.matricule,
      nom: this.nom,
      prenom: this.prenom,
      profil: this.profil as Profil,
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
        this.errorMessage.set('Réinitialisation impossible pour le moment.');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
