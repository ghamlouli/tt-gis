import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { GisCloudService } from '../../services/gis-cloud.service';
import { ACCES_TYPES, AccesType, GisCloudRow } from '../../models/gis-cloud.model';

@Component({
  selector: 'app-gis-cloud-collecte',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './gis-cloud-collecte.html',
  styleUrls: ['./gis-cloud-collecte.css']
})
export class GisCloudCollecteComponent implements OnInit {
  accesTypes = ACCES_TYPES;
  accesFiltre = '';

  rows = signal<GisCloudRow[]>([]);
  loading = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private gisCloudService: GisCloudService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  onGouvChange(idGouv: number | null): void {
    this.idGouv = idGouv;
    this.refresh();
  }

  onDelegationChange(idDelegation: number | null): void {
    this.idDelegation = idDelegation;
    this.refresh();
  }

  onAccesChange(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.gisCloudService.list(this.idGouv, this.idDelegation, this.accesFiltre || null).subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
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
