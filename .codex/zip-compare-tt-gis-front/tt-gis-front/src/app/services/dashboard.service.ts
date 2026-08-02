import { Injectable } from '@angular/core';

import {
  DashboardBar,
  DashboardInsight,
  DashboardKpi,
  DashboardModuleKey,
  ModuleDashboardView
} from '../models/dashboard.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private entityCrudService: EntityCrudService) {}

  getDashboard(module: DashboardModuleKey): ModuleDashboardView {
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

  private buildMetroEthernetDashboard(): ModuleDashboardView {
    const metros = this.entityCrudService.getAll('metro_ethernet');
    const liens = this.entityCrudService.getAll('lien_fo');
    const totalCapacity = this.entityCrudService.sumNumericField('metro_ethernet', 'capacite_totale_fo');
    const usedCapacity = this.entityCrudService.sumNumericField('metro_ethernet', 'capacite_utilisee');
    const usageRate = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
    const saturatedCount = metros.filter(record => {
      const total = this.toNumber(record['capacite_totale_fo']);
      const used = this.toNumber(record['capacite_utilisee']);
      return total > 0 && used / total >= 0.85;
    }).length;
    const activeLinks = liens.filter(record => record['statut'] === 'Actif').length;

    const bars = metros
      .slice(0, 6)
      .map(record => ({
        label: String(record['nom'] ?? 'Metro'),
        value: this.toNumber(record['capacite_utilisee']),
        max: Math.max(this.toNumber(record['capacite_totale_fo']), 1),
        unit: 'Gb'
      }));

    return {
      kpis: [
        {
          label: 'MetroEthernet',
          value: String(metros.length),
          hint: `${metros.length} équipement(s)`,
          icon: 'bi-hdd-network',
          tone: 'info'
        },
        {
          label: 'Capacité FO',
          value: `${usedCapacity}/${totalCapacity} Gb`,
          hint: `${usageRate}% utilisée`,
          icon: 'bi-speedometer2',
          tone: usageRate > 85 ? 'warning' : 'success'
        },
        {
          label: 'Liens FO',
          value: String(liens.length),
          hint: `${activeLinks} actif(s)`,
          icon: 'bi-diagram-3',
          tone: 'default'
        },
        {
          label: 'Saturation',
          value: String(saturatedCount),
          hint: 'Équipements > 85%',
          icon: 'bi-exclamation-triangle',
          tone: saturatedCount > 0 ? 'warning' : 'success'
        }
      ],
      bars,
      distribution: this.toDistribution(this.entityCrudService.groupByField('metro_ethernet', 'vendor')),
      insights: [
        {
          title: 'Taux d\'occupation réseau',
          description: usageRate > 0
            ? `La capacité FO est utilisée à ${usageRate}%. Surveillez les équipements proches de la saturation.`
            : 'Ajoutez des MetroEthernet pour visualiser l\'occupation de capacité.',
          icon: 'bi-graph-up-arrow',
          tone: usageRate > 85 ? 'warning' : 'info'
        },
        {
          title: 'Supervision des liens',
          description: liens.length > 0
            ? `${liens.length} lien(s) FO enregistré(s), dont ${activeLinks} actif(s).`
            : 'Aucun lien FO associé. Complétez les cellules depuis le module Cellules.',
          icon: 'bi-link-45deg',
          tone: 'default'
        }
      ]
    };
  }

  private buildGsmDashboard(): ModuleDashboardView {
    const sites = this.entityCrudService.getAll('station_gsm');
    const cellules = this.entityCrudService.getAll('cellule_gsm');
    const activeSites = sites.filter(record => record['statut'] === 'Actif').length;
    const maintenanceSites = sites.filter(record => record['statut'] === 'Maintenance').length;
    const avgCellsPerSite = sites.length > 0 ? (cellules.length / sites.length).toFixed(1) : '0';

    const bars = sites
      .slice(0, 6)
      .map(record => ({
        label: String(record['nom'] ?? 'Site'),
        value: cellules.filter(cell => String(cell['id_station']) === String(record.id)).length,
        max: Math.max(cellules.length, 1),
        unit: 'cell.'
      }));

    return {
      kpis: [
        {
          label: 'Sites GSM',
          value: String(sites.length),
          hint: `${activeSites} actif(s)`,
          icon: 'bi-broadcast-pin',
          tone: 'info'
        },
        {
          label: 'Cellules',
          value: String(cellules.length),
          hint: `${avgCellsPerSite} / site en moyenne`,
          icon: 'bi-reception-4',
          tone: 'default'
        },
        {
          label: 'Maintenance',
          value: String(maintenanceSites),
          hint: 'Sites à traiter',
          icon: 'bi-tools',
          tone: maintenanceSites > 0 ? 'warning' : 'success'
        },
        {
          label: 'Couverture',
          value: sites.length > 0 ? `${Math.round((activeSites / sites.length) * 100)}%` : '0%',
          hint: 'Sites opérationnels',
          icon: 'bi-geo-alt',
          tone: 'success'
        }
      ],
      bars,
      distribution: this.toDistribution(this.entityCrudService.groupByField('cellule_gsm', 'technologies')),
      insights: [
        {
          title: 'Répartition radio',
          description: cellules.length > 0
            ? 'Analysez les technologies déployées pour équilibrer 4G/5G sur le territoire.'
            : 'Ajoutez des cellules GSM pour analyser les bandes et technologies.',
          icon: 'bi-wifi',
          tone: 'info'
        },
        {
          title: 'Sites prioritaires',
          description: maintenanceSites > 0
            ? `${maintenanceSites} site(s) en maintenance nécessitent un suivi rapproché.`
            : 'Aucun site en maintenance. Réseau GSM stable.',
          icon: 'bi-shield-check',
          tone: maintenanceSites > 0 ? 'warning' : 'success'
        }
      ]
    };
  }

  private buildFiliaireDashboard(): ModuleDashboardView {
    const msans = this.entityCrudService.getAll('msan');
    const cables = this.entityCrudService.getAll('cable_cuivre');
    const totalLines = this.entityCrudService.sumNumericField('msan', 'nb_lignes_total');
    const assignedLines = this.entityCrudService.sumNumericField('msan', 'nb_lignes_attribuees');
    const remainingLines = this.entityCrudService.sumNumericField('msan', 'nb_lignes_restantes');
    const cableTotal = this.entityCrudService.sumNumericField('cable_cuivre', 'capacite_totale');
    const cableUsed = this.entityCrudService.sumNumericField('cable_cuivre', 'capacite_attribuee');
    const lineUsage = totalLines > 0 ? Math.round((assignedLines / totalLines) * 100) : 0;

    const bars: DashboardBar[] = msans.slice(0, 6).map(record => ({
      label: String(record['nom'] ?? 'MSAN'),
      value: this.toNumber(record['nb_lignes_attribuees']),
      max: Math.max(this.toNumber(record['nb_lignes_total']), 1),
      unit: 'lignes'
    }));

    return {
      kpis: [
        {
          label: 'MSAN',
          value: String(msans.length),
          hint: 'Équipements filaires',
          icon: 'bi-router',
          tone: 'info'
        },
        {
          label: 'Lignes totales',
          value: String(totalLines),
          hint: `${assignedLines} attribuées`,
          icon: 'bi-telephone',
          tone: 'default'
        },
        {
          label: 'Capacité restante',
          value: String(remainingLines),
          hint: `${lineUsage}% d\'occupation`,
          icon: 'bi-pie-chart',
          tone: lineUsage > 80 ? 'warning' : 'success'
        },
        {
          label: 'Câbles cuivre',
          value: String(cables.length),
          hint: `${cableUsed}/${cableTotal} capacité`,
          icon: 'bi-lightning',
          tone: 'default'
        }
      ],
      bars,
      distribution: this.toDistribution(this.entityCrudService.groupByField('msan', 'statut')),
      insights: [
        {
          title: 'Saturation MSAN',
          description: lineUsage > 80
            ? `Les lignes MSAN sont occupées à ${lineUsage}%. Anticiper l'extension de capacité.`
            : 'La capacité MSAN reste confortable pour absorber de nouvelles lignes.',
          icon: 'bi-bar-chart-steps',
          tone: lineUsage > 80 ? 'warning' : 'success'
        },
        {
          title: 'Parc cuivre',
          description: cables.length > 0
            ? `${cables.length} câble(s) cuivre suivis avec ${cableTotal - cableUsed} unités disponibles.`
            : 'Enregistrez les câbles cuivre pour compléter la vue filaire.',
          icon: 'bi-plug',
          tone: 'info'
        }
      ]
    };
  }

  private buildFibreOptiqueDashboard(): ModuleDashboardView {
    const switches = this.entityCrudService.getAll('switch_outdoor');
    const assigned = this.entityCrudService.sumNumericField('switch_outdoor', 'capacite_attribuee');
    const remaining = this.entityCrudService.sumNumericField('switch_outdoor', 'capacite_restante');
    const totalCapacity = assigned + remaining;
    const usageRate = totalCapacity > 0 ? Math.round((assigned / totalCapacity) * 100) : 0;
    const downCount = switches.filter(record => record['statut'] === 'En panne').length;
    const maintenanceCount = switches.filter(record => record['statut'] === 'Maintenance').length;

    const bars = switches.slice(0, 6).map(record => ({
      label: String(record['nom'] ?? 'Switch'),
      value: this.toNumber(record['capacite_attribuee']),
      max: Math.max(this.toNumber(record['capacite_attribuee']) + this.toNumber(record['capacite_restante']), 1),
      unit: 'Gb'
    }));

    return {
      kpis: [
        {
          label: 'Switch outdoor',
          value: String(switches.length),
          hint: 'Équipements FO',
          icon: 'bi-hdd-rack',
          tone: 'info'
        },
        {
          label: 'Capacité FO',
          value: `${assigned}/${totalCapacity}`,
          hint: `${usageRate}% attribuée`,
          icon: 'bi-speedometer',
          tone: usageRate > 85 ? 'warning' : 'success'
        },
        {
          label: 'Disponibilité',
          value: switches.length > 0
            ? `${Math.round(((switches.length - downCount) / switches.length) * 100)}%`
            : '100%',
          hint: `${downCount} en panne`,
          icon: 'bi-activity',
          tone: downCount > 0 ? 'danger' : 'success'
        },
        {
          label: 'Maintenance',
          value: String(maintenanceCount),
          hint: 'Interventions planifiées',
          icon: 'bi-wrench-adjustable',
          tone: maintenanceCount > 0 ? 'warning' : 'default'
        }
      ],
      bars,
      distribution: this.toDistribution(this.entityCrudService.groupByField('switch_outdoor', 'statut')),
      insights: [
        {
          title: 'Charge des switch',
          description: usageRate > 0
            ? `La capacité FO outdoor est utilisée à ${usageRate}%. Prioriser les sites proches du seuil critique.`
            : 'Ajoutez des switch outdoor pour suivre la capacité et les VLAN.',
          icon: 'bi-diagram-2',
          tone: usageRate > 85 ? 'warning' : 'info'
        },
        {
          title: 'Incidents actifs',
          description: downCount > 0
            ? `${downCount} switch en panne. Vérifier les liaisons FO associées immédiatement.`
            : 'Aucun switch en panne. Supervision FO nominale.',
          icon: 'bi-bell',
          tone: downCount > 0 ? 'danger' : 'success'
        }
      ]
    };
  }

  private buildFhDashboard(): ModuleDashboardView {
    const links = this.entityCrudService.getAll('lien_fh');
    const avgAvailability = this.entityCrudService.averageNumericField('lien_fh', 'disponibilite_pct');
    const totalCapacity = this.entityCrudService.sumNumericField('lien_fh', 'capacite_mbps');
    const avgLength = this.entityCrudService.averageNumericField('lien_fh', 'longueur_km');
    const downCount = links.filter(record => record['statut'] === 'En panne').length;
    const activeCount = links.filter(record => record['statut'] === 'Actif').length;

    const bars = links.slice(0, 6).map(record => ({
      label: String(record['nom_lien'] ?? 'Lien FH'),
      value: this.toNumber(record['disponibilite_pct']),
      max: 100,
      unit: '%'
    }));

    return {
      kpis: [
        {
          label: 'Liens FH',
          value: String(links.length),
          hint: `${activeCount} actif(s)`,
          icon: 'bi-broadcast',
          tone: 'info'
        },
        {
          label: 'Disponibilité',
          value: links.length > 0 ? `${avgAvailability.toFixed(1)}%` : '—',
          hint: 'Moyenne du parc',
          icon: 'bi-check2-circle',
          tone: avgAvailability >= 98 ? 'success' : avgAvailability >= 95 ? 'warning' : 'danger'
        },
        {
          label: 'Capacité totale',
          value: `${totalCapacity} Mbps`,
          hint: 'Somme des liens',
          icon: 'bi-lightning-charge',
          tone: 'default'
        },
        {
          label: 'Longueur moy.',
          value: links.length > 0 ? `${avgLength.toFixed(1)} km` : '—',
          hint: `${downCount} lien(s) en panne`,
          icon: 'bi-rulers',
          tone: downCount > 0 ? 'danger' : 'default'
        }
      ],
      bars,
      distribution: this.toDistribution(this.entityCrudService.groupByField('lien_fh', 'type_modulation')),
      insights: [
        {
          title: 'Qualité radio FH',
          description: avgAvailability >= 98
            ? 'La disponibilité FH est excellente. Continuer la supervision préventive.'
            : avgAvailability > 0
              ? `Disponibilité moyenne à ${avgAvailability.toFixed(1)}%. Analyser les liens sous le seuil SLA.`
              : 'Ajoutez des liens FH pour calculer la disponibilité et la capacité radio.',
          icon: 'bi-signal',
          tone: avgAvailability >= 98 ? 'success' : 'warning'
        },
        {
          title: 'Topologie',
          description: links.length > 0
            ? `Portée moyenne de ${avgLength.toFixed(1)} km entre sites FH. Vérifier l'alignement azimutal si baisse de qualité.`
            : 'Le tableau de bord FH s\'alimente automatiquement depuis les enregistrements du module Site FH.',
          icon: 'bi-compass',
          tone: 'info'
        }
      ]
    };
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
