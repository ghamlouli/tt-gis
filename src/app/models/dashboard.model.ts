export type DashboardModuleKey =
  | 'metroethernet'
  | 'gsm'
  | 'filiaire'
  | 'fibre-optique'
  | 'fh';

export type DashboardQuickLink = {
  label: string;
  route: string;
  icon?: string;
};

export type ModuleDashboardPageData = {
  module: DashboardModuleKey;
  badge: string;
  title: string;
  subtitle: string;
  intro?: string;
  accent: string;
  quickLinks: DashboardQuickLink[];
};

export type DashboardKpi = {
  label: string;
  value: string;
  hint: string;
  icon: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type DashboardBar = {
  label: string;
  value: number;
  max: number;
  unit?: string;
};

export type DashboardInsight = {
  title: string;
  description: string;
  icon: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type ModuleDashboardView = {
  kpis: DashboardKpi[];
  bars: DashboardBar[];
  distribution: { label: string; count: number }[];
  insights: DashboardInsight[];
};
