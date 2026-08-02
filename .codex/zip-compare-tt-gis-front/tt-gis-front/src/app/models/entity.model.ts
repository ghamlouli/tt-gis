import { SCHEMA_FIELDS } from './schema-fields';

export type EntityTableKey = keyof typeof SCHEMA_FIELDS;

export type EntityRecord = {
  id: number;
  [field: string]: string | number | null;
};

export type EntityCrudPageData = {
  badge?: string;
  title: string;
  subtitle: string;
  intro?: string;
  accent?: string;
  entities: EntityTableKey[];
};

export const ENTITY_LABELS: Record<EntityTableKey, string> = {
  metro_ethernet: 'MetroEthernet',
  lien_fo: 'Lien fibre optique',
  station_gsm: 'Station GSM',
  cellule_gsm: 'Cellule GSM',
  msan: 'MSAN',
  cable_cuivre: 'Câble cuivre',
  switch_outdoor: 'Switch outdoor',
  lien_fh: 'Lien FH',
  utilisateur: 'Utilisateur',
  role: 'Rôle',
  utilisateur_role: 'Attribution rôle'
};
