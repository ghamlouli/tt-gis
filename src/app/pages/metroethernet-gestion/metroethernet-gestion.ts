import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { MetroEthernetService } from '../../services/metro-ethernet.service';
import { MetroEthernet } from '../../models/metro-ethernet.model';

@Component({
  selector: 'app-metroethernet-gestion',
  standalone: true,
  imports: [FormsModule, NgIf, GeoSelectComponent],
  templateUrl: './metroethernet-gestion.html',
  styleUrls: ['./metroethernet-gestion.css']
})
export class MetroEthernetGestionComponent implements OnInit {
  @ViewChild(GeoSelectComponent) geoSelect!: GeoSelectComponent;

  code = '';
  nom = '';
  idDelegation: number | null = null;
  coordX: number | null = null;
  coordY: number | null = null;
  ipGestion = '';
  portsRaccordes: number | null = null;
  portsOccupes: number | null = null;

  editingId: number | null = null;
  editMode = signal(false);

  get portsLibres(): number {
    const raccordes = this.portsRaccordes ?? 0;
    const occupes = this.portsOccupes ?? 0;
    return Math.max(raccordes - occupes, 0);
  }

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private metroEthernetService: MetroEthernetService,
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
    this.metroEthernetService.list(null, null).subscribe({
      next: items => {
        const item = items.find(i => i.idMetro === id);
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

    if (!this.code || !this.nom || !this.idDelegation || this.portsRaccordes == null || this.portsOccupes == null) {
      this.errorMessage.set('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    if (this.portsOccupes > this.portsRaccordes) {
      this.errorMessage.set('Les ports occupés ne peuvent pas dépasser les ports raccordés.');
      return;
    }

    this.loading.set(true);

    const payload: MetroEthernet = {
      code: this.code,
      nom: this.nom,
      idDelegation: this.idDelegation,
      coordX: this.coordX,
      coordY: this.coordY,
      ipGestion: this.ipGestion,
      portsRaccordes: this.portsRaccordes,
      portsOccupes: this.portsOccupes
    };

    if (this.editMode() && this.editingId) {
      this.metroEthernetService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Équipement MetroEthernet modifié avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de la modification.");
        }
      });
    } else {
      this.metroEthernetService.create(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Équipement MetroEthernet inséré avec succès.');
          this.resetForm();
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? "Erreur lors de l'insertion.");
        }
      });
    }
  }

  loadForEdit(item: MetroEthernet): void {
    this.editingId = item.idMetro ?? null;
    this.editMode.set(true);
    this.code = item.code;
    this.nom = item.nom;
    this.idDelegation = item.idDelegation;
    this.coordX = item.coordX ?? null;
    this.coordY = item.coordY ?? null;
    this.ipGestion = item.ipGestion ?? '';
    this.portsRaccordes = item.portsRaccordes;
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
    this.ipGestion = '';
    this.portsRaccordes = null;
    this.portsOccupes = null;
    this.geoSelect.reset();
  }
}
