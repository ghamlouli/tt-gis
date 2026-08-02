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

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  activeMenu: string | null = null;
  currentRole = 'VISITEUR';
  currentUserName = '';
  userInitials = 'TT';
  currentPath = '';

  /**
   * Un seul menu par module : Gestion + Tableau de bord (comme demandé).
   * GIS Cloud a ses 2 pages dédiées (Collecte de données / Visualisation)
   * au lieu d'une fenêtre modale.
   */
  readonly networkModules: NavModule[] = [
    {
      id: 'metroethernet',
      label: 'MetroEthernet',
      shortLabel: 'ME',
      accent: '#2563eb',
      links: [
        { label: 'Gestion', route: '/workspace/metroethernet/gestion' },
        { label: 'Tableau de bord', route: '/workspace/metroethernet/dashboard' }
      ]
    },
    {
      id: 'gsm',
      label: 'GSM',
      shortLabel: 'GS',
      accent: '#0891b2',
      links: [
        { label: 'Gestion', route: '/workspace/gsm/gestion' },
        { label: 'Tableau de bord', route: '/workspace/gsm/dashboard' }
      ]
    },
    {
      id: 'msan',
      label: 'MSAN',
      shortLabel: 'MS',
      accent: '#7c3aed',
      links: [
        { label: 'Gestion', route: '/workspace/msan/gestion' },
        { label: 'Tableau de bord', route: '/workspace/msan/dashboard' }
      ]
    },
    {
      id: 'switchoutdoor',
      label: 'SwitchOutdoor',
      shortLabel: 'SO',
      accent: '#059669',
      links: [
        { label: 'Gestion', route: '/workspace/switchoutdoor/gestion' },
        { label: 'Tableau de bord', route: '/workspace/switchoutdoor/dashboard' }
      ]
    },
    {
      id: 'fh',
      label: 'FH',
      shortLabel: 'FH',
      accent: '#ea580c',
      links: [
        { label: 'Gestion', route: '/workspace/fh/gestion' },
        { label: 'Tableau de bord', route: '/workspace/fh/dashboard' }
      ]
    },
    {
      id: 'gis-cloud',
      label: 'GIS Cloud',
      shortLabel: 'GC',
      accent: '#0f172a',
      links: [
        { label: 'Collecte de données', route: '/workspace/gis-cloud/collecte' },
        { label: 'Visualisation', route: '/workspace/gis-cloud/visualisation' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentRole = this.authService.getCurrentProfil();
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
  }

  navigateTo(route: string, event?: Event): void {
    event?.stopPropagation();
    this.activeMenu = null;
    this.router.navigate([route]);
  }

  isModuleActive(module: NavModule): boolean {
    return this.currentPath.includes(`/workspace/${module.id}`);
  }

  isHomeActive(): boolean {
    return this.currentPath === '/workspace' || this.currentPath === '/workspace/';
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.currentRole === 'Admin';
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
