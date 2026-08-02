import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { catchError, forkJoin, map, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { GisApiService, GisResource } from '../../services/gis-api.service';

type WorkspaceCard = {
  title: string;
  description: string;
  items: string[];
  actionLabel?: string;
  route?: string;
  accent?: string;
  shortLabel?: string;
  /** Clé de ressource backend, ex: 'metroethernets' */
  resource?: GisResource;
};

type WorkspaceMetric = {
  label: string;
  value: string;
};

type WorkspacePageData = {
  badge?: string;
  title: string;
  subtitle: string;
  intro?: string;
  metrics?: WorkspaceMetric[];
  cards?: WorkspaceCard[];
};

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './workspace-page.html',
  styleUrl: './workspace-page.css'
})
export class WorkspacePageComponent implements OnInit {
  readonly page: WorkspacePageData;
  readonly userName: string;
  readonly isMainMenu: boolean;
  readonly recordCounts: Record<string, number | null> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    authService: AuthService,
    private gisApiService: GisApiService
  ) {
    this.page = this.route.snapshot.data as WorkspacePageData;
    this.userName = authService.getDisplayName();
    this.isMainMenu = !this.route.snapshot.routeConfig?.path;
  }

  ngOnInit(): void {
    this.loadRecordCounts();
  }

  openCard(card: WorkspaceCard): void {
    if (card.route) {
      this.router.navigate([card.route]);
    }
  }

  hasRecordCount(card: WorkspaceCard): boolean {
    return this.recordCounts[card.title] !== undefined;
  }

  private loadRecordCounts(): void {
    const cards = this.page.cards ?? [];

    const requests = cards
      .filter(card => Boolean(card.resource))
      .map(card => {
        this.recordCounts[card.title] = null;

        return this.gisApiService.list<unknown>(card.resource!).pipe(
          map(records => ({ title: card.title, count: records.length })),
          catchError(() => of({ title: card.title, count: 0 }))
        );
      });

    if (!requests.length) {
      return;
    }

    forkJoin(requests).subscribe(results => {
      for (const result of results) {
        this.recordCounts[result.title] = result.count;
      }
    });
  }
}