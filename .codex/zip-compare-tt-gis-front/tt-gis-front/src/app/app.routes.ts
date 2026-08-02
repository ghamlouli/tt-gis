import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { WorkspaceShellComponent } from './components/workspace-shell/workspace-shell';
import { WorkspacePageComponent } from './pages/workspace-page/workspace-page';
import { EntityCrudPageComponent } from './pages/entity-crud/entity-crud-page';
import { ModuleDashboardComponent } from './pages/module-dashboard/module-dashboard';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'workspace',
    component: WorkspaceShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: WorkspacePageComponent,
        data: {
          badge: 'TT GIS',
          title: 'Menu principal',
          subtitle: 'Centralisez l\'accès aux modules réseau, aux tableaux de bord et aux outils métiers.',
          intro: 'Sélectionnez un module ci-dessous ou utilisez la barre de navigation pour accéder rapidement aux formulaires.',
          metrics: [
            { label: 'Modules', value: '7' },
            { label: 'Rôles', value: '4' },
            { label: 'Statut', value: 'Live' }
          ],
          cards: [
            {
              title: 'MetroEthernet',
              shortLabel: 'ME',
              accent: '#2563eb',
              route: '/workspace/metroethernet/dashboard',
              description: 'Manipulation des MetroEthernet et gestion des cellules associées.',
              items: ['Cellules associées', 'CRUD MetroEthernet', 'Tableau de bord'],
              actionLabel: 'Accéder au module'
            },
            {
              title: 'GSM',
              shortLabel: 'GS',
              accent: '#0891b2',
              route: '/workspace/gsm/dashboard',
              description: 'Gestion des sites GSM, des cellules GSM et des indicateurs de supervision.',
              items: ['Gestion site', 'Gestion cellule GSM', 'Tableau de bord'],
              actionLabel: 'Ouvrir le module'
            },
            {
              title: 'Filaire',
              shortLabel: 'FL',
              accent: '#7c3aed',
              route: '/workspace/filiaire/dashboard',
              description: 'Administration MSAN et suivi des capacités fibre optique.',
              items: ['Gestion MSAN', 'Tableau de bord'],
              actionLabel: 'Consulter'
            },
            {
              title: 'Fibre Optique',
              shortLabel: 'FO',
              accent: '#059669',
              route: '/workspace/fibre-optique/dashboard',
              description: 'Gestion des switch outdoor et supervision des liaisons fibre.',
              items: ['Gestion switch outdoor', 'Tableau de bord'],
              actionLabel: 'Voir les formulaires'
            },
            {
              title: 'FH',
              shortLabel: 'FH',
              accent: '#ea580c',
              route: '/workspace/fh/dashboard',
              description: 'Administration des sites FH et suivi des liens radio.',
              items: ['Site FH', 'Tableau de bord'],
              actionLabel: 'Ouvrir le formulaire'
            },
            {
              title: 'Gestion de la base',
              shortLabel: 'DB',
              accent: '#0f172a',
              route: '/workspace/gestion-base',
              description: 'Administration des utilisateurs, rôles et données de la plateforme.',
              items: ['Utilisateurs', 'Rôles', 'Intégration SQL'],
              actionLabel: 'Gérer la base'
            }
          ]
        }
      },
      {
        path: 'metroethernet',
        children: [
          {
            path: 'cellules',
            component: EntityCrudPageComponent,
            data: {
              badge: 'MetroEthernet',
              title: 'Cellules associées',
              subtitle: 'Association des cellules au MetroEthernet sélectionné.',
              intro: 'Gérez les liens fibre optique associés aux équipements MetroEthernet.',
              accent: '#2563eb',
              entities: ['lien_fo']
            }
          },
          {
            path: 'crud',
            component: EntityCrudPageComponent,
            data: {
              badge: 'MetroEthernet',
              title: 'CRUD MetroEthernet',
              subtitle: 'Créer, modifier, consulter et supprimer les équipements MetroEthernet.',
              intro: 'Interface complète de gestion des enregistrements metro_ethernet.',
              accent: '#2563eb',
              entities: ['metro_ethernet']
            }
          },
          {
            path: 'dashboard',
            component: ModuleDashboardComponent,
            data: {
              module: 'metroethernet',
              badge: 'MetroEthernet',
              title: 'Tableau de bord MetroEthernet',
              subtitle: 'Supervision intelligente de la capacité FO et des liens associés.',
              intro: 'Les indicateurs se calculent automatiquement à partir des enregistrements MetroEthernet et liens FO.',
              accent: '#2563eb',
              quickLinks: [
                { label: 'CRUD MetroEthernet', route: '/workspace/metroethernet/crud', icon: 'bi-hdd-network' },
                { label: 'Cellules associées', route: '/workspace/metroethernet/cellules', icon: 'bi-diagram-3' }
              ]
            }
          }
        ]
      },
      {
        path: 'gsm',
        children: [
          {
            path: 'site',
            component: EntityCrudPageComponent,
            data: {
              badge: 'GSM',
              title: 'Gestion site GSM',
              subtitle: 'Création et mise à jour des sites GSM.',
              intro: 'Gérez les enregistrements de la table station_gsm.',
              accent: '#0891b2',
              entities: ['station_gsm']
            }
          },
          {
            path: 'cellule',
            component: EntityCrudPageComponent,
            data: {
              badge: 'GSM',
              title: 'Gestion cellule GSM',
              subtitle: 'Administration des cellules et paramètres radio.',
              intro: 'Gérez les enregistrements de la table cellule_gsm.',
              accent: '#0891b2',
              entities: ['cellule_gsm']
            }
          },
          {
            path: 'dashboard',
            component: ModuleDashboardComponent,
            data: {
              module: 'gsm',
              badge: 'GSM',
              title: 'Tableau de bord GSM',
              subtitle: 'Vue opérationnelle des sites radio et cellules déployées.',
              intro: 'Analyse automatique des statuts site, couverture cellulaire et technologies actives.',
              accent: '#0891b2',
              quickLinks: [
                { label: 'Gestion site GSM', route: '/workspace/gsm/site', icon: 'bi-broadcast-pin' },
                { label: 'Gestion cellule GSM', route: '/workspace/gsm/cellule', icon: 'bi-reception-4' }
              ]
            }
          }
        ]
      },
      {
        path: 'filiaire',
        children: [
          {
            path: 'msan',
            component: EntityCrudPageComponent,
            data: {
              badge: 'Filaire',
              title: 'Gestion MSAN',
              subtitle: 'Création et suivi des équipements MSAN et câbles cuivre.',
              intro: 'Gérez les enregistrements MSAN et câbles cuivre associés.',
              accent: '#7c3aed',
              entities: ['msan', 'cable_cuivre']
            }
          },
          {
            path: 'dashboard',
            component: ModuleDashboardComponent,
            data: {
              module: 'filiaire',
              badge: 'Filaire',
              title: 'Tableau de bord Filaire',
              subtitle: 'Suivi MSAN, lignes cuivre et saturation du réseau d\'accès.',
              intro: 'KPI calculés depuis les enregistrements MSAN et câbles cuivre.',
              accent: '#7c3aed',
              quickLinks: [
                { label: 'Gestion MSAN', route: '/workspace/filiaire/msan', icon: 'bi-router' }
              ]
            }
          }
        ]
      },
      {
        path: 'fibre-optique',
        children: [
          {
            path: 'switch',
            component: EntityCrudPageComponent,
            data: {
              badge: 'Fibre Optique',
              title: 'Gestion switch outdoor',
              subtitle: 'Création et mise à jour des switch outdoor.',
              intro: 'Gérez les enregistrements de la table switch_outdoor.',
              accent: '#059669',
              entities: ['switch_outdoor']
            }
          },
          {
            path: 'dashboard',
            component: ModuleDashboardComponent,
            data: {
              module: 'fibre-optique',
              badge: 'Fibre Optique',
              title: 'Tableau de bord Fibre Optique',
              subtitle: 'Pilotage des switch outdoor, capacités et incidents FO.',
              intro: 'Indicateurs dynamiques basés sur les switch outdoor enregistrés.',
              accent: '#059669',
              quickLinks: [
                { label: 'Gestion switch outdoor', route: '/workspace/fibre-optique/switch', icon: 'bi-hdd-rack' }
              ]
            }
          }
        ]
      },
      {
        path: 'fh',
        children: [
          {
            path: 'site',
            component: EntityCrudPageComponent,
            data: {
              badge: 'FH',
              title: 'Site FH',
              subtitle: 'Gestion des sites FH et des liaisons radio.',
              intro: 'Gérez les enregistrements de la table lien_fh.',
              accent: '#ea580c',
              entities: ['lien_fh']
            }
          },
          {
            path: 'dashboard',
            component: ModuleDashboardComponent,
            data: {
              module: 'fh',
              badge: 'FH',
              title: 'Tableau de bord FH',
              subtitle: 'Supervision radio FH : disponibilité, capacité et topologie.',
              intro: 'Analyse automatique des liens FH, modulation et qualité de service.',
              accent: '#ea580c',
              quickLinks: [
                { label: 'Site FH', route: '/workspace/fh/site', icon: 'bi-broadcast' }
              ]
            }
          }
        ]
      },
      {
        path: 'gestion-base',
        component: EntityCrudPageComponent,
        data: {
          badge: 'Base',
          title: 'Gestion de la base',
          subtitle: 'Administration des utilisateurs, rôles et attributions.',
          intro: 'Gérez les enregistrements utilisateur, rôle et utilisateur_role.',
          accent: '#0f172a',
          entities: ['utilisateur', 'role', 'utilisateur_role']
        }
      }
    ]
  },
  { path: 'client', redirectTo: 'workspace', pathMatch: 'full' },
  { path: 'ingenieur', redirectTo: 'workspace', pathMatch: 'full' },
  { path: 'gerant', redirectTo: 'workspace', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'workspace', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
