import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { GeoService } from '..//app/services/geo.service';
import { Delegation, Gouvernorat } from '../app/models/geo.model';

/**
 * Sélecteur Gouvernorat -> Délégation réutilisé par tous les modules
 * (MetroEthernet, GSM, MSAN, SwitchOutdoor, FH, GIS Cloud).
 * Émet idGouv / idDelegation choisis.
 */
@Component({
  selector: 'app-geo-select',
  standalone: true,
  imports: [FormsModule, NgFor],
  template: `
    <div class="geo-select">
      <div class="field">
        <label>Gouvernorat</label>
        <select [(ngModel)]="selectedGouvId" (ngModelChange)="onGouvChange($event)">
          <option [ngValue]="null" [disabled]="required">{{ allowAll ? 'Tous les gouvernorats' : 'Sélectionner un gouvernorat' }}</option>
          <option *ngFor="let g of gouvernorats()" [ngValue]="g.idGouv">{{ g.nom }}</option>
        </select>
      </div>

      <div class="field">
        <label>Délégation</label>
        <select [(ngModel)]="selectedDelegationId" (ngModelChange)="onDelegationChange($event)" [disabled]="!selectedGouvId">
          <option [ngValue]="null" [disabled]="required">{{ allowAll ? 'Toutes les délégations' : 'Sélectionner une délégation' }}</option>
          <option *ngFor="let d of delegations()" [ngValue]="d.idDelegation">{{ d.nom }}</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .geo-select { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    label { font-size: 0.85rem; font-weight: 600; color: #334155; }
    select { padding: 10px 12px; border-radius: 10px; border: 1px solid #dbe3f0; background: #f8fafc; }
  `]
})
export class GeoSelectComponent implements OnInit {
  /** true = champs obligatoires (formulaire de création) ; false = filtres facultatifs (tableau de bord) */
  @Input() required = false;
  /** true = affiche "Tous/Toutes" comme option par défaut (tableaux de bord) */
  @Input() allowAll = true;

  @Output() gouvernoratChange = new EventEmitter<number | null>();
  @Output() delegationChange = new EventEmitter<number | null>();

  gouvernorats = signal<Gouvernorat[]>([]);
  delegations = signal<Delegation[]>([]);

  selectedGouvId: number | null = null;
  selectedDelegationId: number | null = null;

  constructor(private geoService: GeoService) {}

  ngOnInit(): void {
    this.geoService.listGouvernorats().subscribe(list => this.gouvernorats.set(list));
  }

  onGouvChange(idGouv: number | null): void {

    this.selectedGouvId = idGouv;

    this.selectedDelegationId = null;

    this.delegations.set([]);

    // IMPORTANT :
    // on notifie d'abord le nouveau gouvernorat,
    // puis la remise à zéro de la délégation.
    this.gouvernoratChange.emit(idGouv);

    this.delegationChange.emit(null);

    if (!idGouv) {
      return;
    }

    this.geoService
      .listDelegationsByGouvernorat(idGouv)
      .subscribe(list => this.delegations.set(list));
  }

  onDelegationChange(idDelegation: number | null): void {
    this.delegationChange.emit(idDelegation);
  }

  reset(): void {
    this.selectedGouvId = null;
    this.selectedDelegationId = null;
    this.delegations.set([]);
  }
}
