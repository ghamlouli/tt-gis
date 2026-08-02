import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';

type NavLink = {
  label: string;
  route: string;
};

type NavModule = {
  id: string;
  label: string;
  shortLabel: string;
  accent: string;
  links: NavLink[];
};

type NavTool = {
  id: string;
  label: string;
  route?: string;
  action?: 'gis-cloud';
  muted?: boolean;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  activeMenu: string | null = null;
  gisCloudModalOpen = false;
  mapGenerated = false;
  currentRole = 'VISITEUR';
  currentUserName = '';
  userInitials = 'TT';
  currentPath = '';

  readonly networkModules: NavModule[] = [
    {
      id: 'metroethernet',
      label: 'MetroEthernet',
      shortLabel: 'ME',
      accent: '#2563eb',
      links: [
        { label: 'Cellules associées', route: '/workspace/metroethernet/cellules' },
        { label: 'Manipulation et CRUD', route: '/workspace/metroethernet/crud' },
        { label: 'Tableau de bord', route: '/workspace/metroethernet/dashboard' }
      ]
    },
    {
      id: 'gsm',
      label: 'GSM',
      shortLabel: 'GS',
      accent: '#0891b2',
      links: [
        { label: 'Gestion site', route: '/workspace/gsm/site' },
        { label: 'Gestion cellule GSM', route: '/workspace/gsm/cellule' },
        { label: 'Tableau de bord', route: '/workspace/gsm/dashboard' }
      ]
    },
    {
      id: 'filiaire',
      label: 'Filaire',
      shortLabel: 'FL',
      accent: '#7c3aed',
      links: [
        { label: 'Gestion MSAN', route: '/workspace/filiaire/msan' },
        { label: 'Tableau de bord', route: '/workspace/filiaire/dashboard' }
      ]
    },
    {
      id: 'fibre-optique',
      label: 'Fibre Optique',
      shortLabel: 'FO',
      accent: '#059669',
      links: [
        { label: 'Gestion switch outdoor', route: '/workspace/fibre-optique/switch' },
        { label: 'Tableau de bord', route: '/workspace/fibre-optique/dashboard' }
      ]
    },
    {
      id: 'fh',
      label: 'FH',
      shortLabel: 'FH',
      accent: '#ea580c',
      links: [
        { label: 'Site FH', route: '/workspace/fh/site' },
        { label: 'Tableau de bord', route: '/workspace/fh/dashboard' }
      ]
    }
  ];

  readonly tools: NavTool[] = [
    { id: 'gis-cloud', label: 'GIS Cloud', action: 'gis-cloud' },
    { id: 'bi', label: 'BI', muted: true },
    { id: 'gestion-base', label: 'Gestion de la base', route: '/workspace/gestion-base' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentRole = this.authService.getCurrentRoleLabel();
    this.currentUserName = this.authService.getDisplayName();
    this.userInitials = this.buildInitials(this.currentUserName);
    this.currentPath = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentPath = (event as NavigationEnd).urlAfterRedirects;
        this.activeMenu = null;
      });
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.activeMenu = null;
  }

  toggleDropdown(menu: string, event: Event): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === menu ? null : menu;
    this.gisCloudModalOpen = false;
  }

  navigateTo(route: string, event?: Event): void {
    event?.stopPropagation();
    this.activeMenu = null;
    this.gisCloudModalOpen = false;
    this.router.navigate([route]);
  }

  openTool(tool: NavTool, event: Event): void {
    event.stopPropagation();

    if (tool.action === 'gis-cloud') {
      this.showGISCloudModal();
      return;
    }

    if (tool.route) {
      this.navigateTo(tool.route);
    }
  }

  isModuleActive(module: NavModule): boolean {
    return this.currentPath.includes(`/workspace/${module.id}`);
  }

  isToolActive(tool: NavTool): boolean {
    return Boolean(tool.route && this.currentPath.startsWith(tool.route));
  }

  isHomeActive(): boolean {
    return this.currentPath === '/workspace' || this.currentPath === '/workspace/';
  }

  logout(): void {
    this.authService.logout();
  }

  showGISCloudModal(): void {
    this.activeMenu = null;
    this.gisCloudModalOpen = true;
  }

  closeGISCloudModal(): void {
    this.gisCloudModalOpen = false;
  }

  generateMap(): void {
    this.mapGenerated = true;
  }

  private buildInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
      return 'TT';
    }

    return parts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
