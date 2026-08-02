import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { GeoSelectComponent } from '../../../shared/geo-select';
import { exportToExcel, exportToPdf } from '../../../shared/export.util';
import { MetroEthernetService } from '../../services/metro-ethernet.service';
import { MetroEthernet } from '../../models/metro-ethernet.model';

const COLUMNS = ['Code', 'Nom', 'Gouvernorat', 'Délégation', 'X', 'Y', 'IP', 'Raccordés', 'Occupés', 'Libres'];

@Component({
  selector: 'app-metroethernet-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, GeoSelectComponent],
  templateUrl: './metroethernet-dashboard.html',
  styleUrls: ['./metroethernet-dashboard.css']
})
export class MetroEthernetDashboardComponent implements OnInit {
  rows = signal<MetroEthernet[]>([]);
  loading = signal(false);

  private idGouv: number | null = null;
  private idDelegation: number | null = null;
  private refresh$ = new Subject<void>(); 


  constructor(
    private metroEthernetService: MetroEthernetService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.refresh$
      .pipe(
        switchMap(() => {

          this.loading.set(true);

          return this.metroEthernetService.list(
            this.idGouv,
            this.idDelegation
          );

        })
      )
      .subscribe({

        next: data => {

          this.rows.set(data);

          this.loading.set(false);

        },

        error: () => {

          this.loading.set(false);

        }

      });

    this.refresh$.next();

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
    this.refresh$.next();
  }

  exportPdf(): void {
    exportToPdf('Tableau de bord MetroEthernet', COLUMNS, this.toRows(), 'metroethernet');
  }

  exportExcel(): void {
    exportToExcel('MetroEthernet', COLUMNS, this.toRows(), 'metroethernet');
  }

  private toRows(): (string | number)[][] {
    return this.rows().map(r => [
      r.code, r.nom, r.gouvernorat ?? '', r.delegation ?? '',
      r.coordX ?? '', r.coordY ?? '', r.ipGestion ?? '',
      r.portsRaccordes, r.portsOccupes, r.portsLibres ?? 0
    ]);
  }

  onEdit(item: MetroEthernet): void {
    this.router.navigate(['/workspace/metroethernet/gestion'], { 
      queryParams: { editId: item.idMetro } 
    });
  }

  onDelete(item: MetroEthernet): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'équipement ${item.nom} ?`)) {
      return;
    }

    this.loading.set(true);
    this.metroEthernetService.remove(item.idMetro!).subscribe({
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
