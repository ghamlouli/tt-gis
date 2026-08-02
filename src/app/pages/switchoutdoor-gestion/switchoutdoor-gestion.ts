import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { SwitchOutdoorService } from '../../services/switch-outdoor.service';
import { SwitchOutdoor } from '../../models/switch-outdoor.model';

@Component({
  selector: 'app-switchoutdoor-gestion',
  standalone: true,
  imports: [FormsModule, NgIf, GeoSelectComponent],
  templateUrl: './switchoutdoor-gestion.html',
  styleUrls: ['./switchoutdoor-gestion.css']
})
export class SwitchOutdoorGestionComponent implements OnInit {
  @ViewChild(GeoSelectComponent) geoSelect!: GeoSelectComponent;

  code = '';
  nom = '';
  idDelegation: number | null = null;
  coordX: number | null = null;
  coordY: number | null = null;
  portsAttribues: number | null = null;
  portsOccupes: number | null = null;

  editingId: number | null = null;
  editMode = signal(false);

  get portsLibres(): number {
    const attribues = this.portsAttribues ?? 0;
    const occupes = this.portsOccupes ?? 0;
    return Math.max(attribues - occupes, 0);
  }

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private switchOutdoorService: SwitchOutdoorService,
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
    this.switchOutdoorService.list(null, null).subscribe({
      next: items => {
        const item = items.find(i => i.idSwitch === id);
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

    if (!this.code || !this.nom || !this.idDelegation || this.portsAttribues == null || this.portsOccupes == null) {
      this.errorMessage.set('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    if (this.portsOccupes > this.portsAttribues) {
      this.errorMessage.set('Les ports occupés ne peuvent pas dépasser les ports attribués.');
      return;
    }

    this.loading.set(true);

    const payload: SwitchOutdoor = {
      code: this.code,
      nom: this.nom,
      idDelegation: this.idDelegation,
      coordX: this.coordX,
      coordY: this.coordY,
      portsAttribues: this.portsAttribues,
      portsOccupes: this.portsOccupes
    };

    if (this.editMode() && this.editingId) {
      this.switchOutdoorService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Switch outdoor modifié avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de la modification.");
        }
      });
    } else {
      this.switchOutdoorService.create(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Switch outdoor inséré avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de l'insertion.");
        }
      });
    }
  }

  loadForEdit(item: SwitchOutdoor): void {
    this.editingId = item.idSwitch ?? null;
    this.editMode.set(true);
    this.code = item.code;
    this.nom = item.nom;
    this.idDelegation = item.idDelegation;
    this.coordX = item.coordX ?? null;
    this.coordY = item.coordY ?? null;
    this.portsAttribues = item.portsAttribues;
    this.portsOccupes = item.portsOccupes;
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
    this.portsAttribues = null;
    this.portsOccupes = null;
    this.geoSelect.reset();
  }
}
