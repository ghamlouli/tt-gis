import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { StationGsmService } from '../../services/station-gsm.service';
import { FOURNISSEURS, Fournisseur, StationGsm, TECHNOLOGIES, Technologie } from '../../models/station-gsm.model';

@Component({
  selector: 'app-gsm-gestion',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './gsm-gestion.html',
  styleUrls: ['./gsm-gestion.css']
})
export class GsmGestionComponent implements OnInit {
  @ViewChild(GeoSelectComponent) geoSelect!: GeoSelectComponent;

  technologiesDisponibles = TECHNOLOGIES;
  fournisseurs = FOURNISSEURS;

  code = '';
  nom = '';
  idDelegation: number | null = null;
  coordX: number | null = null;
  coordY: number | null = null;
  technologiesSelectionnees: Record<Technologie, boolean> = { '2G': false, '3G': false, '4G': false, '5G': false };
  fournisseur: Fournisseur | '' = '';

  editingId: number | null = null;
  editMode = signal(false);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private stationGsmService: StationGsmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const editId = this.route.snapshot.queryParamMap.get('editId');
    if (editId) {
      this.loadItemForEdit(Number(editId));
    }
  }

  private loadItemForEdit(id: number): void {
    this.loading.set(true);
    this.stationGsmService.list(null, null, null).subscribe({
      next: items => {
        const item = items.find(i => i.idStation === id);
        if (item) {
          this.loadForEdit(item);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Erreur lors du chargement des données.');
      }
    });
  }

  onDelegationSelected(idDelegation: number | null): void {
    this.idDelegation = idDelegation;
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const technologies = this.technologiesDisponibles.filter(t => this.technologiesSelectionnees[t]);

    if (!this.code || !this.nom || !this.idDelegation || !this.fournisseur || technologies.length === 0) {
      this.errorMessage.set('Tous les champs obligatoires doivent être remplis (au moins une technologie).');
      return;
    }

    this.loading.set(true);

    const payload: StationGsm = {
      code: this.code,
      nom: this.nom,
      idDelegation: this.idDelegation,
      coordX: this.coordX,
      coordY: this.coordY,
      technologies,
      fournisseur: this.fournisseur as Fournisseur
    };

    if (this.editMode() && this.editingId) {
      this.stationGsmService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Site GSM modifié avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de la modification.");
        }
      });
    } else {
      this.stationGsmService.create(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Site GSM inséré avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de l'insertion.");
        }
      });
    }
  }

  loadForEdit(item: StationGsm): void {
    this.editingId = item.idStation ?? null;
    this.editMode.set(true);
    this.code = item.code;
    this.nom = item.nom;
    this.idDelegation = item.idDelegation;
    this.coordX = item.coordX ?? null;
    this.coordY = item.coordY ?? null;
    this.fournisseur = item.fournisseur;
    this.technologiesSelectionnees = { '2G': false, '3G': false, '4G': false, '5G': false };
    item.technologies.forEach(t => {
      this.technologiesSelectionnees[t] = true;
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingId = null;
    this.editMode.set(false);
    this.code = '';
    this.nom = '';
    this.idDelegation = null;
    this.coordX = null;
    this.coordY = null;
    this.fournisseur = '';
    this.technologiesSelectionnees = { '2G': false, '3G': false, '4G': false, '5G': false };
    this.geoSelect.reset();
  }
}
