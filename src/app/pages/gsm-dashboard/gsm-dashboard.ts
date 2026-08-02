import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { exportToExcel, exportToPdf } from '../../../shared/export.util';
import { StationGsmService } from '../../services/station-gsm.service';
import { FOURNISSEURS, StationGsm } from '../../models/station-gsm.model';

const COLUMNS = ['Code', 'Nom', 'Gouvernorat', 'Délégation', 'X', 'Y', 'Technologies', 'Fournisseur'];

@Component({
  selector: 'app-gsm-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './gsm-dashboard.html',
  styleUrls: ['./gsm-dashboard.css']
})
export class GsmDashboardComponent implements OnInit {
  fournisseurs = FOURNISSEURS;
  rows = signal<StationGsm[]>([]);
  loading = signal(false);

  fournisseurFiltre = '';
  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private stationGsmService: StationGsmService,
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

  onFournisseurChange(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.stationGsmService.list(this.idGouv, this.idDelegation, this.fournisseurFiltre || null).subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportPdf(): void {
    exportToPdf('Tableau de bord GSM', COLUMNS, this.toRows(), 'gsm');
  }

  exportExcel(): void {
    exportToExcel('GSM', COLUMNS, this.toRows(), 'gsm');
  }

  private toRows(): (string | number)[][] {
    return this.rows().map(r => [
      r.code, r.nom, r.gouvernorat ?? '', r.delegation ?? '',
      r.coordX ?? '', r.coordY ?? '', r.technologies.join(', '), r.fournisseur
    ]);
  }

  onEdit(item: StationGsm): void {
    this.router.navigate(['/workspace/gsm/gestion'], { 
      queryParams: { editId: item.idStation } 
    });
  }

  onDelete(item: StationGsm): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la station ${item.nom} ?`)) {
      return;
    }

    this.loading.set(true);
    this.stationGsmService.remove(item.idStation!).subscribe({
      next: () => {
        this.loading.set(false);
        this.refresh();
      },
      error: () => {
        this.loading.set(false);
        alert('Erreur lors de la suppression.');
      }
    });
  }
}
