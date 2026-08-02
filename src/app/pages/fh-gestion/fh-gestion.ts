import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { LienFHService } from '../../services/lien-fh.service';
import { LienFH } from '../../models/lien-fh.model';

@Component({
  selector: 'app-fh-gestion',
  standalone: true,
  imports: [FormsModule, NgIf, GeoSelectComponent],
  templateUrl: './fh-gestion.html',
  styleUrls: ['./fh-gestion.css']
})
export class FhGestionComponent implements OnInit {
  @ViewChild(GeoSelectComponent) geoSelect!: GeoSelectComponent;

  code = '';
  nom = '';
  idDelegation: number | null = null;
  coordX: number | null = null;
  coordY: number | null = null;

  editingId: number | null = null;
  editMode = signal(false);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private lienFHService: LienFHService,
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
    this.lienFHService.list(null, null).subscribe({
      next: items => {
        const item = items.find(i => i.idFh === id);
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

    if (!this.code || !this.nom || !this.idDelegation) {
      this.errorMessage.set('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    this.loading.set(true);

    const payload: LienFH = {
      code: this.code,
      nom: this.nom,
      idDelegation: this.idDelegation,
      coordX: this.coordX,
      coordY: this.coordY
    };

    if (this.editMode() && this.editingId) {
      this.lienFHService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Lien FH modifié avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de la modification.");
        }
      });
    } else {
      this.lienFHService.create(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Lien FH inséré avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de l'insertion.");
        }
      });
    }
  }

  loadForEdit(item: LienFH): void {
    this.editingId = item.idFh ?? null;
    this.editMode.set(true);
    this.code = item.code;
    this.nom = item.nom;
    this.idDelegation = item.idDelegation;
    this.coordX = item.coordX ?? null;
    this.coordY = item.coordY ?? null;
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
    this.geoSelect.reset();
  }
}
