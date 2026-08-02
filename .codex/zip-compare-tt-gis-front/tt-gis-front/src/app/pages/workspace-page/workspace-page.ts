import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { AuthService } from '../../services/auth.service';

type WorkspaceCard = {
  title: string;
  description: string;
  items: string[];
  actionLabel?: string;
  route?: string;
  accent?: string;
  shortLabel?: string;
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
export class WorkspacePageComponent {
  readonly page: WorkspacePageData;
  readonly userName: string;
  readonly isMainMenu: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    authService: AuthService
  ) {
    this.page = this.route.snapshot.data as WorkspacePageData;
    this.userName = authService.getDisplayName();
    this.isMainMenu = !this.route.snapshot.routeConfig?.path;
  }

  openCard(card: WorkspaceCard): void {
    if (card.route) {
      this.router.navigate([card.route]);
    }
  }
}
