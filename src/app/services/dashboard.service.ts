import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';

import {
  DashboardBar,
  DashboardModuleKey,
  ModuleDashboardView
} from '../models/dashboard.model';
import { EntityRecord } from '../models/entity.model';
import { EntityCrudService } from '../services/entity-crud.service'; 

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private entityCrudService: EntityCrudService) {}

  getDashboard(module: DashboardModuleKey): Observable<ModuleDashboardView> {
    switch (module) {
      case 'metroethernet':
        return this.buildMetroEthernetDashboard();
      case 'gsm':
        return this.buildGsmDashboard();
      case 'filiaire':
        return this.buildFiliaireDashboard();
      case 'fibre-optique':
        return this.buildFibreOptiqueDashboard();
      case 'fh':
        return this.buildFhDashboard();
    }
  }

  private buildMetroEthernetDashboard(): Observable<ModuleDashboardView> {
    return forkJoin({
      metros: this.safeGetAll('metro_ethernet'),
      liens: this.safeGetAll('lien_fo')
    }).pipe(
      map(({ metros, liens }) => {
        const totalCapacity = this.sum(metros, 'capacite_totale_fo');
        const usedCapacity = this.sum(metros, 'capacite_utilisee');
        const usageRate = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
        const saturatedCount = metros.filter(record => {
          const total = this.toNumber(record['capacite_totale_fo']);
          const used = this.toNumber(record['capacite_utilisee']);
          return total > 0 && used / total >= 0.85;
        }).length;
        const activeLinks = liens.filter(record => record['statut'] === 'Actif').length;

        return {
          kpis: [
            { label: 'MetroEthernet', value: String(metros.length), hint: `${metros.length} equipement(s)`, icon: 'bi-hdd-network', tone: 'info' },
            { label: 'Capacite FO', value: `${usedCapacity}/${totalCapacity} Gb`, hint: `${usageRate}% utilisee`, icon: 'bi-speedometer2', tone: usageRate > 85 ? 'warning' : 'success' },
            { label: 'Liens FO', value: String(liens.length), hint: `${activeLinks} actif(s)`, icon: 'bi-diagram-3', tone: 'default' },
            { label: 'Saturation', value: String(saturatedCount), hint: 'Equipements > 85%', icon: 'bi-exclamation-triangle', tone: saturatedCount > 0 ? 'warning' : 'success' }
          ],
          bars: metros.slice(0, 6).map(record => ({
            label: String(record['nom'] ?? 'Metro'),
            value: this.toNumber(record['capacite_utilisee']),
            max: Math.max(this.toNumber(record['capacite_totale_fo']), 1),
            unit: 'Gb'
          })),
          distribution: this.toDistribution(this.groupBy(metros, 'vendor')),
          insights: [
            {
              title: 'Taux occupation reseau',
              description: usageRate > 0
                ? `La capacite FO est utilisee a ${usageRate}%. Surveillez les equipements proches de la saturation.`
                : 'Ajoutez des MetroEthernet pour visualiser occupation de capacite.',
              icon: 'bi-graph-up-arrow',
              tone: usageRate > 85 ? 'warning' : 'info'
            },
            {
              title: 'Supervision des liens',
              description: liens.length > 0
                ? `${liens.length} lien(s) FO enregistre(s), dont ${activeLinks} actif(s).`
                : 'Aucun lien FO associe. Completez les cellules depuis le module Cellules.',
              icon: 'bi-link-45deg',
              tone: 'default'
            }
          ]
        };
      })
    );
  }

  private buildGsmDashboard(): Observable<ModuleDashboardView> {
    return forkJoin({
      sites: this.safeGetAll('station_gsm'),
      cellules: this.safeGetAll('cellule_gsm')
    }).pipe(
      map(({ sites, cellules }) => {
        const activeSites = sites.filter(record => record['statut'] === 'Actif').length;
        const maintenanceSites = sites.filter(record => record['statut'] === 'Maintenance').length;
        const avgCellsPerSite = sites.length > 0 ? (cellules.length / sites.length).toFixed(1) : '0';

        return {
          kpis: [
            { label: 'Sites GSM', value: String(sites.length), hint: `${activeSites} actif(s)`, icon: 'bi-broadcast-pin', tone: 'info' },
            { label: 'Cellules', value: String(cellules.length), hint: `${avgCellsPerSite} / site en moyenne`, icon: 'bi-reception-4', tone: 'default' },
            { label: 'Maintenance', value: String(maintenanceSites), hint: 'Sites a traiter', icon: 'bi-tools', tone: maintenanceSites > 0 ? 'warning' : 'success' },
            { label: 'Couverture', value: sites.length > 0 ? `${Math.round((activeSites / sites.length) * 100)}%` : '0%', hint: 'Sites operationnels', icon: 'bi-geo-alt', tone: 'success' }
          ],
          bars: sites.slice(0, 6).map(record => ({
            label: String(record['nom'] ?? 'Site'),
            value: cellules.filter(cell => String(cell['id_station']) === String(record.id)).length,
            max: Math.max(cellules.length, 1),
            unit: 'cell.'
          })),
          distribution: this.toDistribution(this.groupBy(cellules, 'technologies')),
          insights: [
            {
              title: 'Repartition radio',
              description: cellules.length > 0
                ? 'Analysez les technologies deployees pour equilibrer 4G/5G sur le territoire.'
                : 'Ajoutez des cellules GSM pour analyser les bandes et technologies.',
              icon: 'bi-wifi',
              tone: 'info'
            },
            {
              title: 'Sites prioritaires',
              description: maintenanceSites > 0
                ? `${maintenanceSites} site(s) en maintenance necessitent un suivi rapproche.`
                : 'Aucun site en maintenance. Reseau GSM stable.',
              icon: 'bi-shield-check',
              tone: maintenanceSites > 0 ? 'warning' : 'success'
            }
          ]
        };
      })
    );
  }

  private buildFiliaireDashboard(): Observable<ModuleDashboardView> {
    return forkJoin({
      msans: this.safeGetAll('msan'),
      cables: this.safeGetAll('cable_cuivre')
    }).pipe(
      map(({ msans, cables }) => {
        const totalLines = this.sum(msans, 'nb_lignes_total');
        const assignedLines = this.sum(msans, 'nb_lignes_attribuees');
        const remainingLines = this.sum(msans, 'nb_lignes_restantes');
        const cableTotal = this.sum(cables, 'capacite_totale');
        const cableUsed = this.sum(cables, 'capacite_attribuee');
        const lineUsage = totalLines > 0 ? Math.round((assignedLines / totalLines) * 100) : 0;
        const bars: DashboardBar[] = msans.slice(0, 6).map(record => ({
          label: String(record['nom'] ?? 'MSAN'),
          value: this.toNumber(record['nb_lignes_attribuees']),
          max: Math.max(this.toNumber(record['nb_lignes_total']), 1),
          unit: 'lignes'
        }));

        return {
          kpis: [
            { label: 'MSAN', value: String(msans.length), hint: 'Equipements filaires', icon: 'bi-router', tone: 'info' },
            { label: 'Lignes totales', value: String(totalLines), hint: `${assignedLines} attribuees`, icon: 'bi-telephone', tone: 'default' },
            { label: 'Capacite restante', value: String(remainingLines), hint: `${lineUsage}% occupation`, icon: 'bi-pie-chart', tone: lineUsage > 80 ? 'warning' : 'success' },
            { label: 'Cables cuivre', value: String(cables.length), hint: `${cableUsed}/${cableTotal} capacite`, icon: 'bi-lightning', tone: 'default' }
          ],
          bars,
          distribution: this.toDistribution(this.groupBy(msans, 'statut')),
          insights: [
            {
              title: 'Saturation MSAN',
              description: lineUsage > 80
                ? `Les lignes MSAN sont occupees a ${lineUsage}%. Anticiper extension de capacite.`
                : 'La capacite MSAN reste confortable pour absorber de nouvelles lignes.',
              icon: 'bi-bar-chart-steps',
              tone: lineUsage > 80 ? 'warning' : 'success'
            },
            {
              title: 'Parc cuivre',
              description: cables.length > 0
                ? `${cables.length} cable(s) cuivre suivis avec ${cableTotal - cableUsed} unites disponibles.`
                : 'Enregistrez les cables cuivre pour completer la vue filaire.',
              icon: 'bi-plug',
              tone: 'info'
            }
          ]
        };
      })
    );
  }

  private buildFibreOptiqueDashboard(): Observable<ModuleDashboardView> {
    return this.safeGetAll('switch_outdoor').pipe(
      map(switches => {
        const assigned = this.sum(switches, 'capacite_attribuee');
        const remaining = this.sum(switches, 'capacite_restante');
        const totalCapacity = assigned + remaining;
        const usageRate = totalCapacity > 0 ? Math.round((assigned / totalCapacity) * 100) : 0;
        const downCount = switches.filter(record => record['statut'] === 'En panne').length;
        const maintenanceCount = switches.filter(record => record['statut'] === 'Maintenance').length;

        return {
          kpis: [
            { label: 'Switch outdoor', value: String(switches.length), hint: 'Equipements FO', icon: 'bi-hdd-rack', tone: 'info' },
            { label: 'Capacite FO', value: `${assigned}/${totalCapacity}`, hint: `${usageRate}% attribuee`, icon: 'bi-speedometer', tone: usageRate > 85 ? 'warning' : 'success' },
            { label: 'Disponibilite', value: switches.length > 0 ? `${Math.round(((switches.length - downCount) / switches.length) * 100)}%` : '100%', hint: `${downCount} en panne`, icon: 'bi-activity', tone: downCount > 0 ? 'danger' : 'success' },
            { label: 'Maintenance', value: String(maintenanceCount), hint: 'Interventions planifiees', icon: 'bi-wrench-adjustable', tone: maintenanceCount > 0 ? 'warning' : 'default' }
          ],
          bars: switches.slice(0, 6).map(record => ({
            label: String(record['nom'] ?? 'Switch'),
            value: this.toNumber(record['capacite_attribuee']),
            max: Math.max(this.toNumber(record['capacite_attribuee']) + this.toNumber(record['capacite_restante']), 1),
            unit: 'Gb'
          })),
          distribution: this.toDistribution(this.groupBy(switches, 'statut')),
          insights: [
            {
              title: 'Charge des switch',
              description: usageRate > 0
                ? `La capacite FO outdoor est utilisee a ${usageRate}%. Prioriser les sites proches du seuil critique.`
                : 'Ajoutez des switch outdoor pour suivre la capacite et les VLAN.',
              icon: 'bi-diagram-2',
              tone: usageRate > 85 ? 'warning' : 'info'
            },
            {
              title: 'Incidents actifs',
              description: downCount > 0
                ? `${downCount} switch en panne. Verifier les liaisons FO associees immediatement.`
                : 'Aucun switch en panne. Supervision FO nominale.',
              icon: 'bi-bell',
              tone: downCount > 0 ? 'danger' : 'success'
            }
          ]
        };
      })
    );
  }

  private buildFhDashboard(): Observable<ModuleDashboardView> {
    return this.safeGetAll('lien_fh').pipe(
      map(links => {
        const avgAvailability = this.average(links, 'disponibilite_pct');
        const totalCapacity = this.sum(links, 'capacite_mbps');
        const avgLength = this.average(links, 'longueur_km');
        const downCount = links.filter(record => record['statut'] === 'En panne').length;
        const activeCount = links.filter(record => record['statut'] === 'Actif').length;

        return {
          kpis: [
            { label: 'Liens FH', value: String(links.length), hint: `${activeCount} actif(s)`, icon: 'bi-broadcast', tone: 'info' },
            { label: 'Disponibilite', value: links.length > 0 ? `${avgAvailability.toFixed(1)}%` : '-', hint: 'Moyenne du parc', icon: 'bi-check2-circle', tone: avgAvailability >= 98 ? 'success' : avgAvailability >= 95 ? 'warning' : 'danger' },
            { label: 'Capacite totale', value: `${totalCapacity} Mbps`, hint: 'Somme des liens', icon: 'bi-lightning-charge', tone: 'default' },
            { label: 'Longueur moy.', value: links.length > 0 ? `${avgLength.toFixed(1)} km` : '-', hint: `${downCount} lien(s) en panne`, icon: 'bi-rulers', tone: downCount > 0 ? 'danger' : 'default' }
          ],
          bars: links.slice(0, 6).map(record => ({
            label: String(record['nom_lien'] ?? 'Lien FH'),
            value: this.toNumber(record['disponibilite_pct']),
            max: 100,
            unit: '%'
          })),
          distribution: this.toDistribution(this.groupBy(links, 'type_modulation')),
          insights: [
            {
              title: 'Qualite radio FH',
              description: avgAvailability >= 98
                ? 'La disponibilite FH est excellente. Continuer la supervision preventive.'
                : avgAvailability > 0
                  ? `Disponibilite moyenne a ${avgAvailability.toFixed(1)}%. Analyser les liens sous le seuil SLA.`
                  : 'Ajoutez des liens FH pour calculer la disponibilite et la capacite radio.',
              icon: 'bi-signal',
              tone: avgAvailability >= 98 ? 'success' : 'warning'
            },
            {
              title: 'Topologie',
              description: links.length > 0
                ? `Portee moyenne de ${avgLength.toFixed(1)} km entre sites FH.`
                : 'Le tableau de bord FH alimente automatiquement depuis les enregistrements du module Site FH.',
              icon: 'bi-compass',
              tone: 'info'
            }
          ]
        };
      })
    );
  }

  private safeGetAll(table: Parameters<EntityCrudService['getAll']>[0]): Observable<EntityRecord[]> {
    if (!this.entityCrudService.hasBackendResource(table)) {
      return of([]);
    }

    return this.entityCrudService.getAll(table);
  }

  private sum(records: EntityRecord[], field: string): number {
    return records.reduce((total, record) => total + this.toNumber(record[field]), 0);
  }

  private average(records: EntityRecord[], field: string): number {
    const populatedRecords = records.filter(record => record[field] !== null && record[field] !== '');

    if (!populatedRecords.length) {
      return 0;
    }

    return this.sum(populatedRecords, field) / populatedRecords.length;
  }

  private groupBy(records: EntityRecord[], field: string): Record<string, number> {
    return records.reduce<Record<string, number>>((groups, record) => {
      const key = String(record[field] ?? 'Non renseigne');
      groups[key] = (groups[key] ?? 0) + 1;
      return groups;
    }, {});
  }

  private toDistribution(groups: Record<string, number>): { label: string; count: number }[] {
    return Object.entries(groups)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }));
  }

  private toNumber(value: string | number | null | undefined): number {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}

