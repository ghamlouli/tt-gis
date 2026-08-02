import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { AccesType } from '../app/models/gis-cloud.model';

/**
 * Symbole distinctif par mode d'accès, utilisé dans le tableau de
 * "visualisation" du module GIS Cloud.
 */
@Component({
  selector: 'app-acces-symbol',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  template: `
    <div [ngSwitch]="acces">
      <img *ngSwitchCase="'GSM'" src="assets/gsm-symbol.png" width="28" height="28" alt="GSM"/>
      <img *ngSwitchCase="'FO'" src="assets/fo-symbol.png" width="28" height="28" alt="FO"/>
      <img *ngSwitchCase="'MSAN'" src="assets/msan-symbol.png" width="28" height="28" alt="MSAN"/>
      <svg *ngSwitchCase="'FH'" width="28" height="28" viewBox="0 0 28 28">
        <rect x="3" y="8" width="22" height="12" rx="3" fill="#ea580c"/>
        <path d="M7 14h4M17 14h4" stroke="#fff" stroke-width="2"/>
        <circle cx="14" cy="14" r="2" fill="#fff"/>
      </svg>
      <svg *ngSwitchCase="'GIS_CLOUD'" width="28" height="28" viewBox="0 0 28 28">
        <rect x="3" y="3" width="22" height="22" rx="5" fill="#0f172a"/>
        <path d="M8 10h12M8 14h8M8 18h10" stroke="#fff" stroke-width="2"/>
      </svg>
    </div>
  `
})
export class AccesSymbolComponent {
  @Input() acces!: AccesType;
}