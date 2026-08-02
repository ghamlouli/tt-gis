import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { MsanService } from '../../services/msan.service';
import { Msan } from '../../models/msan.model';

@Component({
  selector: 'app-msan-gestion',
  standalone: true,
  imports: [FormsModule, NgIf, GeoSelectComponent],
  templateUrl: './msan-gestion.html',
  styleUrls: ['./msan-gestion.css']
})
export class MsanGestionComponent implements OnInit {
  @ViewChild(GeoSelectComponent) geoSelect!: GeoSelectComponent;

  code = '';
  nom = '';
  idDelegation: number | null = null;
  coordX: number | null = null;
  coordY: number | null = null;
  capaciteRaccordee: number | null = null;
  capaciteOccupee: number | null = null;

  editingId: number | null = null;
  editMode = signal(false);

  get capaciteLibre(): number {
    const raccordee = this.capaciteRaccordee ?? 0;
    const occupee = this.capaciteOccupee ?? 0;
    return Math.max(raccordee - occupee, 0);
  }

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private msanService: MsanService,
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
    this.msanService.list(null, null).subscribe({
      next: items => {
        const item = items.find(i => i.idMsan === id);
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

    if (!this.code || !this.nom || !this.idDelegation || this.capaciteRaccordee == null || this.capaciteOccupee == null) {
      this.errorMessage.set('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    if (this.capaciteOccupee > this.capaciteRaccordee) {
      this.errorMessage.set('La capacité occupée ne peut pas dépasser la capacité raccordée.');
      return;
    }

    this.loading.set(true);

    const payload: Msan = {
      code: this.code,
      nom: this.nom,
      idDelegation: this.idDelegation,
      coordX: this.coordX,
      coordY: this.coordY,
      capaciteRaccordee: this.capaciteRaccordee,
      capaciteOccupee: this.capaciteOccupee
    };

    if (this.editMode() && this.editingId) {
      this.msanService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('MSAN modifié avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de la modification.");
        }
      });
    } else {
      this.msanService.create(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('MSAN inséré avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de l'insertion.");
        }
      });
    }
  }

  loadForEdit(item: Msan): void {
    this.editingId = item.idMsan ?? null;
    this.editMode.set(true);
    this.code = item.code;
    this.nom = item.nom;
    this.idDelegation = item.idDelegation;
    this.coordX = item.coordX ?? null;
    this.coordY = item.coordY ?? null;
    this.capaciteRaccordee = item.capaciteRaccordee;
    this.capaciteOccupee = item.capaciteOccupee;
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
    this.capaciteRaccordee = null;
    this.capaciteOccupee = null;
    this.geoSelect.reset();
  }
}
