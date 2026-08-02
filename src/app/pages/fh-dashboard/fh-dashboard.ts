import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { exportToExcel, exportToPdf } from '../../../shared/export.util';
import { LienFHService } from '../../services/lien-fh.service';
import { LienFH } from '../../models/lien-fh.model';

const COLUMNS = ['Code', 'Nom', 'Gouvernorat', 'Délégation', 'X', 'Y'];

@Component({
  selector: 'app-fh-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './fh-dashboard.html',
  styleUrls: ['./fh-dashboard.css']
})
export class FhDashboardComponent implements OnInit {
  rows = signal<LienFH[]>([]);
  loading = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private lienFHService: LienFHService,
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
    this.lienFHService.list(this.idGouv, this.idDelegation).subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportPdf(): void {
    exportToPdf('Tableau de bord FH', COLUMNS, this.toRows(), 'fh');
  }

  exportExcel(): void {
    exportToExcel('FH', COLUMNS, this.toRows(), 'fh');
  }

  private toRows(): (string | number)[][] {
    return this.rows().map(r => [
      r.code, r.nom, r.gouvernorat ?? '', r.delegation ?? '', r.coordX ?? '', r.coordY ?? ''
    ]);
  }

  onEdit(item: LienFH): void {
    this.router.navigate(['/workspace/fh/gestion'], { 
      queryParams: { editId: item.idFh } 
    });
  }

  onDelete(item: LienFH): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le lien FH ${item.nom} ?`)) {
      return;
    }

    this.loading.set(true);
    this.lienFHService.remove(item.idFh!).subscribe({
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
