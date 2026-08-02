import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { AccesSymbolComponent } from '../../../shared/acces-symbol';
import { GisMapComponent } from '../../../shared/gis-map/gis-map';
import { GisCloudService } from '../../services/gis-cloud.service';
import { ACCES_TYPES, AccesType, GisCloudRow } from '../../models/gis-cloud.model';

@Component({
  selector: 'app-gis-cloud-visualisation',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent, AccesSymbolComponent, GisMapComponent],
  templateUrl: './gis-cloud-visualisation.html',
  styleUrls: ['./gis-cloud-visualisation.css']
})
export class GisCloudVisualisationComponent {
  accesTypes = ACCES_TYPES;
  accesFiltre = '';

  rows = signal<GisCloudRow[]>([]);
  loading = signal(false);
  generated = signal(false);

  /**
   * Un seul bouton "Visualiser" sous le tableau (plus de bouton par
   * ligne). Il ne fait qu'afficher/masquer la carte, qui consomme le
   * même signal `rows()` déjà rempli par "Générer" — zéro appel HTTP
   * supplémentaire.
   */
  showMap = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private gisCloudService: GisCloudService,
    private router: Router
  ) {}

  onGouvChange(idGouv: number | null): void {
    this.idGouv = idGouv;
  }

  onDelegationChange(idDelegation: number | null): void {
    this.idDelegation = idDelegation;
  }

  generer(): void {
    this.loading.set(true);
    this.showMap.set(false);

    this.gisCloudService.list(this.idGouv, this.idDelegation, this.accesFiltre || null).subscribe({
      next: data => {
        this.rows.set(data);
        this.generated.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleMap(): void {
    this.showMap.update(value => !value);
  }

  onEdit(row: GisCloudRow): void {
    const routeMap: Record<AccesType, string> = {
      'GSM': '/workspace/gsm/gestion',
      'FO': '/workspace/switchoutdoor/gestion',
      'MSAN': '/workspace/msan/gestion'
    };
    const route = routeMap[row.acces];
    if (route) {
      this.router.navigate([route], { queryParams: { editMode: true, nom: row.nom } });
    }
  }

  onDelete(row: GisCloudRow): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'équipement ${row.nom} (${row.acces}) ?`)) {
      return;
    }
    alert('La suppression doit être effectuée depuis le tableau de bord spécifique au type de réseau.');
  }
}