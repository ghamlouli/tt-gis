import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';

import { GisCloudRow } from '../../app/models/gis-cloud.model';
import { getMarkerIcon } from '../../shared/gis-icons';

/**
 * Composant "dumb" : ne fait AUCUN appel HTTP, ne connaît pas les
 * filtres. Il reçoit exactement les lignes déjà affichées dans le
 * tableau (même signal `rows()`) et les projette sur une carte Leaflet.
 *
 * Générique par construction : chaque ligne porte déjà son `acces`
 * (MetroEthernet, GSM, FO, MSAN, ...), donc ce composant fonctionne
 * pour tous les types de réseaux sans modification — un nouveau type
 * de réseau n'a besoin que d'une entrée dans gis-icons.ts.
 */
@Component({
  selector: 'app-gis-map',
  standalone: true,
  templateUrl: './gis-map.html',
  styleUrls: ['./gis-map.css']
})
export class GisMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() rows: GisCloudRow[] = [];

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;
  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initMap();
    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // La carte n'existe pas encore au premier changement (ngOnChanges
    // s'exécute avant ngAfterViewInit) : on ne redessine que si la vue
    // est prête, sinon ngAfterViewInit s'en charge.
    if (changes['rows'] && this.viewInitialized) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    // Indispensable avec Leaflet + Angular : sans ce nettoyage, l'ancienne
    // instance de carte reste en mémoire (memory leak) à chaque fois que
    // le composant est détruit/recréé (toggle Visualiser).
    this.map?.remove();
    this.map = null;
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [34.0, 9.5], // centre approximatif de la Tunisie
      zoom: 7,
      minZoom: 6,
      maxZoom: 14
    });

    // Limiter la carte à la Tunisie
    const tunisiaBounds = L.latLngBounds([32.0, 7.0], [37.5, 11.5]);
    this.map.setMaxBounds(tunisiaBounds);
    this.map.on('drag', () => {
      this.map?.panInsideBounds(tunisiaBounds, { animate: false });
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 14
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  private renderMarkers(): void {
    if (!this.map || !this.markersLayer) {
      return;
    }

    this.markersLayer.clearLayers();

    const validRows = this.rows.filter(r => r.coordX != null && r.coordY != null);

    const bounds: L.LatLngExpression[] = [];

    for (const row of validRows) {
      // Convention X = longitude, Y = latitude (cohérent avec la saisie
      // des formulaires de gestion de chaque module)
      const lat = Number(row.coordY);
      const lng = Number(row.coordX);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        continue;
      }

      const marker = L.marker([lat, lng], { icon: getMarkerIcon(row.acces) });

      // Survol -> tooltip avec les infos principales
      marker.bindTooltip(this.buildTooltipHtml(row), { direction: 'top', offset: [0, -10] });

      // Clic -> popup / fiche détaillée
      marker.bindPopup(this.buildPopupHtml(row));

      marker.addTo(this.markersLayer);
      bounds.push([lat, lng]);
    }

    if (bounds.length > 0) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30], maxZoom: 14 });
    }
  }

  private buildTooltipHtml(row: GisCloudRow): string {
    return `<strong>${this.escape(row.nom)}</strong><br>${this.escape(row.acces)} — ${this.escape(row.delegation)}`;
  }

  private buildPopupHtml(row: GisCloudRow): string {
    const technologies = row.technologies.length ? row.technologies.join(', ') : '—';
    const portsLibres = row.portsLibres ?? '—';

    return `
      <div class="gis-popup">
        <h4>${this.escape(row.nom)}</h4>
        <table>
          <tr><td>Accès</td><td>${this.escape(row.acces)}</td></tr>
          <tr><td>Gouvernorat</td><td>${this.escape(row.gouvernorat)}</td></tr>
          <tr><td>Délégation</td><td>${this.escape(row.delegation)}</td></tr>
          <tr><td>X</td><td>${row.coordX}</td></tr>
          <tr><td>Y</td><td>${row.coordY}</td></tr>
          <tr><td>Ports libres</td><td>${portsLibres}</td></tr>
          <tr><td>Technologies</td><td>${this.escape(technologies)}</td></tr>
        </table>
      </div>`;
  }

  /** Évite l'injection HTML dans les tooltips/popups (données venant de la base). */
  private escape(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
