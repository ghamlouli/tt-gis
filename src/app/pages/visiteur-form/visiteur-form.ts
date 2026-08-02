import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { LocationPickerComponent } from '../../../shared/location-picker/location-picker';
import { VisiteurService } from '../../services/visiteur.service';
import { Visiteur } from '../../models/visiteur.model';

@Component({
  selector: 'app-visiteur-form',
  standalone: true,
  imports: [FormsModule, NgIf, LocationPickerComponent],
  templateUrl: './visiteur-form.html',
  styleUrls: ['./visiteur-form.css']
})
export class VisiteurFormComponent {
  loading = signal(false);
  errorMessage = signal('');
  showConfirmationModal = signal(false);

  visiteur: Visiteur = {
    cin: '',
    nom: '',
    prenom: '',
    coordX: null,
    coordY: null
  };

  constructor(
    private visiteurService: VisiteurService,
    private router: Router
  ) {}

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.visiteur.coordY = location.lat;
    this.visiteur.coordX = location.lng;
  }

  onSubmit(): void {
    console.log('onSubmit appelé');
    console.log('Données visiteur:', this.visiteur);

    if (!this.visiteur.cin || !this.visiteur.nom || !this.visiteur.prenom) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.visiteur.coordX == null || this.visiteur.coordY == null) {
      this.errorMessage.set('Veuillez sélectionner votre localisation sur la carte.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    console.log('Début appel API');

    this.visiteurService.create(this.visiteur).subscribe({
      next: (response) => {
        console.log('Succès API:', response);
        this.loading.set(false);
        console.log('showConfirmationModal avant:', this.showConfirmationModal());
        this.showConfirmationModal.set(true);
        console.log('showConfirmationModal après:', this.showConfirmationModal());
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading.set(false);
        // Pour le test, afficher le modal même en cas d'erreur
        console.log('showConfirmationModal avant (erreur):', this.showConfirmationModal());
        this.showConfirmationModal.set(true);
        console.log('showConfirmationModal après (erreur):', this.showConfirmationModal());
      }
    });
  }

  onServiceChoice(wantsService: boolean): void {
    this.showConfirmationModal.set(false);

    if (wantsService) {
      // Passer les coordonnées du visiteur à la carte
      this.router.navigate(['/visiteur-map'], {
        queryParams: {
          lat: this.visiteur.coordY,
          lng: this.visiteur.coordX
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
