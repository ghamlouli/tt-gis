import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import {
  DashboardQuickLink,
  ModuleDashboardPageData,
  ModuleDashboardView
} from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-module-dashboard',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './module-dashboard.html',
  styleUrl: './module-dashboard.css'
})
export class ModuleDashboardComponent implements OnInit {
  readonly page: ModuleDashboardPageData;
  dashboard!: ModuleDashboardView;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.page = this.route.snapshot.data as ModuleDashboardPageData;
  }

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.dashboard = this.dashboardService.getDashboard(this.page.module);
  }

  navigateTo(link: DashboardQuickLink): void {
    this.router.navigate([link.route]);
  }

  getDistributionMax(): number {
    if (!this.dashboard.distribution.length) {
      return 1;
    }

    return Math.max(...this.dashboard.distribution.map(item => item.count), 1);
  }

  getBarWidth(value: number, max: number): number {
    return Math.round((value / Math.max(max, 1)) * 100);
  }
}
