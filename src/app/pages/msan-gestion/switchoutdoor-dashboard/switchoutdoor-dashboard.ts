import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../../shared/geo-select';
import { exportToExcel, exportToPdf } from '../../../../shared/export.util';
import { SwitchOutdoorService } from '../../../services/switch-outdoor.service';
import { SwitchOutdoor } from '../../../models/switch-outdoor.model';

const COLUMNS = ['Code', 'Nom', 'Gouvernorat', 'Délégation', 'X', 'Y', 'Attribués', 'Occupés', 'Libres'];

@Component({
  selector: 'app-switchoutdoor-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './switchoutdoor-dashboard.html',
  styleUrls: ['./switchoutdoor-dashboard.css']
})
export class SwitchOutdoorDashboardComponent implements OnInit {
  rows = signal<SwitchOutdoor[]>([]);
  loading = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;

  constructor(
    private switchOutdoorService: SwitchOutdoorService,
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
    this.switchOutdoorService.list(this.idGouv, this.idDelegation).subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportPdf(): void {
    exportToPdf('Tableau de bord switch outdoor', COLUMNS, this.toRows(), 'switch-outdoor');
  }

  exportExcel(): void {
    exportToExcel('SwitchOutdoor', COLUMNS, this.toRows(), 'switch-outdoor');
  }

  private toRows(): (string | number)[][] {
    return this.rows().map(r => [
      r.code, r.nom, r.gouvernorat ?? '', r.delegation ?? '',
      r.coordX ?? '', r.coordY ?? '', r.portsAttribues, r.portsOccupes, r.portsLibres ?? 0
    ]);
  }

  onEdit(item: SwitchOutdoor): void {
    this.router.navigate(['/workspace/switchoutdoor/gestion'], { 
      queryParams: { editId: item.idSwitch } 
    });
  }

  onDelete(item: SwitchOutdoor): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le switch ${item.nom} ?`)) {
      return;
    }

    this.loading.set(true);
    this.switchOutdoorService.remove(item.idSwitch!).subscribe({
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
