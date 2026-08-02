import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { exportToExcel, exportToPdf } from '../../../shared/export.util';
import { MsanService } from '../../services/msan.service';
import { Msan } from '../../models/msan.model';

const COLUMNS = ['Code', 'Nom', 'Gouvernorat', 'Délégation', 'X', 'Y', 'Raccordée', 'Occupée', 'Libre'];

@Component({
  selector: 'app-msan-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './msan-dashboard.html',
  styleUrls: ['./msan-dashboard.css']
})
export class MsanDashboardComponent implements OnInit {
  rows = signal<Msan[]>([]);
  loading = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private msanService: MsanService,
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

  refresh(): void {
    this.loading.set(true);
    this.msanService.list(this.idGouv, this.idDelegation).subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportPdf(): void {
    exportToPdf('Tableau de bord MSAN', COLUMNS, this.toRows(), 'msan');
  }

  exportExcel(): void {
    exportToExcel('MSAN', COLUMNS, this.toRows(), 'msan');
  }

  private toRows(): (string | number)[][] {
    return this.rows().map(r => [
      r.code, r.nom, r.gouvernorat ?? '', r.delegation ?? '',
      r.coordX ?? '', r.coordY ?? '', r.capaciteRaccordee, r.capaciteOccupee, r.capaciteLibre ?? 0
    ]);
  }

  onEdit(item: Msan): void {
    this.router.navigate(['/workspace/msan/gestion'], { 
      queryParams: { editId: item.idMsan } 
    });
  }

  onDelete(item: Msan): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le MSAN ${item.nom} ?`)) {
      return;
    }

    this.loading.set(true);
    this.msanService.remove(item.idMsan!).subscribe({
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
