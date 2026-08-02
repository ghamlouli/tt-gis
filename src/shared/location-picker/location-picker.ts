import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [NgIf],
  templateUrl: './location-picker.html',
  styleUrls: ['./location-picker.css']
})
export class LocationPickerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() initialLat: number | null = null;
  @Input() initialLng: number | null = null;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewInitialized && (changes['initialLat'] || changes['initialLng'])) {
      this.updateMarker();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [34.0, 9.5],
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

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });

    this.updateMarker();
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.updateMarkerPosition(lat, lng);
    this.locationSelected.emit({ lat, lng });
  }

  private updateMarker(): void {
    if (!this.map) return;

    if (this.initialLat != null && this.initialLng != null) {
      this.updateMarkerPosition(this.initialLat, this.initialLng);
      this.map.setView([this.initialLat, this.initialLng], 12);
    }
  }

  private updateMarkerPosition(lat: number, lng: number): void {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #2563eb; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(this.map);

      this.marker.on('dragend', (e: L.DragEndEvent) => {
        const position = e.target.getLatLng();
        this.locationSelected.emit({ lat: position.lat, lng: position.lng });
      });
    }
  }
}
