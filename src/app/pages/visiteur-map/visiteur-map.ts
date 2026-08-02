import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

import { GisCloudService } from '../../services/gis-cloud.service';
import { GisCloudRow, AccesType } from '../../models/gis-cloud.model';
import { getMarkerIcon } from '../../../shared/gis-icons';

@Component({
  selector: 'app-visiteur-map',
  standalone: true,
  imports: [NgIf],
  templateUrl: './visiteur-map.html',
  styleUrls: ['./visiteur-map.css']
})
export class VisiteurMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  loading = signal(false);
  rows = signal<GisCloudRow[]>([]);

  visitorLat = signal<number | null>(null);
  visitorLng = signal<number | null>(null);
  private readonly SEARCH_RADIUS_KM = 10; // Rayon de recherche en kilomètres

  private map: L.Map | null = null;
  private visitorMarker: L.Marker | null = null;
  private accessPointsLayer: L.LayerGroup | null = null;

  filteredRows = computed(() => {
    const visitorLat = this.visitorLat();
    const visitorLng = this.visitorLng();

    if (!visitorLat || !visitorLng) {
      return this.rows();
    }

    return this.rows().filter(row => {
      if (!row.coordX || !row.coordY) return false;

      const distance = this.calculateDistance(
        visitorLat,
        visitorLng,
        row.coordY,
        row.coordX
      );

      return distance <= this.SEARCH_RADIUS_KM;
    });
  });

  constructor(
    private gisCloudService: GisCloudService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer les coordonnées du visiteur depuis les query params
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lng = params['lng'];
      if (lat && lng) {
        this.visitorLat.set(parseFloat(lat));
        this.visitorLng.set(parseFloat(lng));
      }
    });

    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const lat = this.visitorLat() ?? 34.0;
    const lng = this.visitorLng() ?? 9.5;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [lat, lng],
      zoom: 14,
      minZoom: 10,
      maxZoom: 18
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

    this.accessPointsLayer = L.layerGroup().addTo(this.map);

    // Ajouter le marqueur du visiteur
    if (this.visitorLat() && this.visitorLng()) {
      this.addVisitorMarker();
    }
  }

  private addVisitorMarker(): void {
    if (!this.map || !this.visitorLat() || !this.visitorLng()) return;

    const visitorIcon = L.divIcon({
      className: 'visitor-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    this.visitorMarker = L.marker([this.visitorLat()!, this.visitorLng()!], { icon: visitorIcon })
      .addTo(this.map)
      .bindPopup(`
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <strong style="color: #22c55e;">📍 Votre position</strong><br>
          <small>Latitude: ${this.visitorLat()!.toFixed(6)}</small><br>
          <small>Longitude: ${this.visitorLng()!.toFixed(6)}</small>
        </div>
      `);
  }

  private renderAccessPoints(): void {
    if (!this.map || !this.accessPointsLayer) return;

    this.accessPointsLayer.clearLayers();

    const accessTypes = this.filteredRows();

    accessTypes.forEach(row => {
      if (row.coordX && row.coordY) {
        const icon = getMarkerIcon(row.acces as AccesType);
        const marker = L.marker([row.coordY, row.coordX], { icon })
          .bindPopup(`
            <div style="font-family: Arial, sans-serif; min-width: 200px;">
              <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 8px;">
                ${row.acces}
              </div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                📍 ${row.gouvernorat || ''} - ${row.delegation || ''}
              </div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                🏢 ${row.nom || 'N/A'}
              </div>
              ${row.technologies ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                  <div style="font-size: 11px; color: #334155; font-weight: 600;">Technologies:</div>
                  <div style="font-size: 11px; color: #64748b;">${row.technologies.join(', ')}</div>
                </div>
              ` : ''}
            </div>
          `);
        this.accessPointsLayer?.addLayer(marker);
      }
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.gisCloudService.list(null, null, null).subscribe({
      next: data => {
        this.rows.set(data);
        this.renderAccessPoints();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  goBack(): void {
    this.router.navigate(['/visiteur-form']);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
