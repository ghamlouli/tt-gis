import { Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { LoginTtComponent } from './pages/login-tt/login-tt';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { AdminCreateAccountComponent } from './pages/admin-create-account/admin-create-account';
import { VisiteurFormComponent } from './pages/visiteur-form/visiteur-form';
import { VisiteurMapComponent } from './pages/visiteur-map/visiteur-map';

import { WorkspaceShellComponent } from './components/workspace-shell/workspace-shell';
import { WorkspacePageComponent } from './pages/workspace-page/workspace-page';

import { MetroEthernetGestionComponent } from './pages/metroethernet-gestion/metroethernet-gestion';
import { MetroEthernetDashboardComponent } from './pages/metroethernet-dashboard/metroethernet-dashboard';
import { GsmGestionComponent } from './pages/gsm-gestion/gsm-gestion';
import { GsmDashboardComponent } from './pages/gsm-dashboard/gsm-dashboard';
import { MsanGestionComponent } from './pages/msan-gestion/msan-gestion';
import { MsanDashboardComponent } from './pages/msan-dashboard/msan-dashboard';
import { SwitchOutdoorGestionComponent } from './pages/switchoutdoor-gestion/switchoutdoor-gestion';
import { SwitchOutdoorDashboardComponent } from './pages/switchoutdoor-dashboard/switchoutdoor-dashboard';
import { FhGestionComponent } from './pages/fh-gestion/fh-gestion';
import { FhDashboardComponent } from './pages/fh-dashboard/fh-dashboard';
import { GisCloudCollecteComponent } from './pages/gis-cloud-collecte/gis-cloud-collecte';
import { GisCloudVisualisationComponent } from './pages/gis-cloud-visualisation/gis-cloud-visualisation';

import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'login-tt', component: LoginTtComponent, canActivate: [guestGuard] },
  { path: 'visiteur-form', component: VisiteurFormComponent },
  { path: 'visiteur-map', component: VisiteurMapComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'admin/create-account', component: AdminCreateAccountComponent, canActivate: [adminGuard] },

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
          subtitle: "Accès direct aux modules connectés au backend.",
          intro: "Les données sont lues et modifiées via l'API Spring Boot.",
          cards: [
            { title: 'MetroEthernet', shortLabel: 'ME', accent: '#2563eb', route: '/workspace/metroethernet/gestion', description: 'Gestion des équipements MetroEthernet.', items: ['code', 'gouvernorat', 'délégation', 'ports'], actionLabel: 'Gestion' },
            { title: 'GSM', shortLabel: 'GS', accent: '#0891b2', route: '/workspace/gsm/gestion', description: 'Gestion des sites GSM.', items: ['code', 'technologies', 'fournisseur'], actionLabel: 'Gestion' },
            { title: 'MSAN', shortLabel: 'MS', accent: '#7c3aed', route: '/workspace/msan/gestion', description: 'Gestion des MSAN.', items: ['code', 'capacité'], actionLabel: 'Gestion' },
            { title: 'SwitchOutdoor', shortLabel: 'SO', accent: '#059669', route: '/workspace/switchoutdoor/gestion', description: 'Gestion des switchs outdoor.', items: ['code', 'ports'], actionLabel: 'Gestion' },
            { title: 'FH', shortLabel: 'FH', accent: '#ea580c', route: '/workspace/fh/gestion', description: 'Gestion des liens FH.', items: ['code', 'gouvernorat'], actionLabel: 'Gestion' },
            { title: 'GIS Cloud', shortLabel: 'GC', accent: '#0f172a', route: '/workspace/gis-cloud/collecte', description: 'Collecte de données et visualisation.', items: ['accès', 'ports libres', 'technologies'], actionLabel: 'Ouvrir' }
          ]
        }
      },

      { path: 'metroethernet/gestion', component: MetroEthernetGestionComponent, data: { badge: 'MetroEthernet', title: 'Gestion MetroEthernet', accent: '#2563eb' } },
      { path: 'metroethernet/dashboard', component: MetroEthernetDashboardComponent, data: { badge: 'MetroEthernet', title: 'Tableau de bord MetroEthernet', accent: '#2563eb' } },

      { path: 'gsm/gestion', component: GsmGestionComponent, data: { badge: 'GSM', title: 'Gestion site GSM', accent: '#0891b2' } },
      { path: 'gsm/dashboard', component: GsmDashboardComponent, data: { badge: 'GSM', title: 'Tableau de bord GSM', accent: '#0891b2' } },

      { path: 'msan/gestion', component: MsanGestionComponent, data: { badge: 'MSAN', title: 'Gestion MSAN', accent: '#7c3aed' } },
      { path: 'msan/dashboard', component: MsanDashboardComponent, data: { badge: 'MSAN', title: 'Tableau de bord MSAN', accent: '#7c3aed' } },

      { path: 'switchoutdoor/gestion', component: SwitchOutdoorGestionComponent, data: { badge: 'SwitchOutdoor', title: 'Gestion switch outdoor', accent: '#059669' } },
      { path: 'switchoutdoor/dashboard', component: SwitchOutdoorDashboardComponent, data: { badge: 'SwitchOutdoor', title: 'Tableau de bord switch outdoor', accent: '#059669' } },

      { path: 'fh/gestion', component: FhGestionComponent, data: { badge: 'FH', title: 'Gestion FH', accent: '#ea580c' } },
      { path: 'fh/dashboard', component: FhDashboardComponent, data: { badge: 'FH', title: 'Tableau de bord FH', accent: '#ea580c' } },

      { path: 'gis-cloud/collecte', component: GisCloudCollecteComponent, data: { badge: 'GIS Cloud', title: 'Collecte de données', accent: '#0f172a' } },
      { path: 'gis-cloud/visualisation', component: GisCloudVisualisationComponent, data: { badge: 'GIS Cloud', title: 'Visualisation', accent: '#0f172a' } }
    ]
  },

  { path: '**', redirectTo: '' }
];
