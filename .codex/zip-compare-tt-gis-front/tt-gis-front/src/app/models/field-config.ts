import { EntityTableKey } from './entity.model';
import { schemaFields } from './schema-fields';

export type FieldInputType = 'text' | 'number' | 'date' | 'email' | 'password' | 'select';

export type FieldConfig = {
  name: string;
  label: string;
  inputType: FieldInputType;
  options?: string[];
};

const STATUS_OPTIONS = ['Actif', 'Inactif', 'Maintenance', 'En panne', 'Planifié'];

function humanizeFieldName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\bid\b/gi, 'ID')
    .replace(/\bfo\b/gi, 'FO')
    .replace(/\bfh\b/gi, 'FH')
    .replace(/\bgsm\b/gi, 'GSM')
    .replace(/\bdbm\b/gi, 'dBm')
    .replace(/\bdb\b/gi, 'dB')
    .replace(/\bmsan\b/gi, 'MSAN')
    .replace(/\bmbps\b/gi, 'Mbps')
    .replace(/\bmhz\b/gi, 'MHz')
    .replace(/\bkm\b/gi, 'km')
    .replace(/\bpct\b/gi, '%')
    .replace(/\bip\b/gi, 'IP')
    .replace(/\bvlans?\b/gi, 'VLAN')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function inferInputType(fieldName: string): FieldInputType {
  if (fieldName === 'mot_de_passe') {
    return 'password';
  }

  if (fieldName === 'email') {
    return 'email';
  }

  if (fieldName === 'statut') {
    return 'select';
  }

  if (
    fieldName.startsWith('date_') ||
    fieldName.endsWith('_date') ||
    fieldName.includes('date_') ||
    fieldName === 'derniere_connexion'
  ) {
    return 'date';
  }

  if (
    fieldName.startsWith('id_') ||
    fieldName.startsWith('coord_') ||
    fieldName.includes('_km') ||
    fieldName.includes('_m') ||
    fieldName.includes('_db') ||
    fieldName.includes('_pct') ||
    fieldName.includes('_mbps') ||
    fieldName.includes('_mhz') ||
    fieldName.startsWith('capacite') ||
    fieldName.startsWith('nb_') ||
    fieldName.startsWith('cout_') ||
    fieldName === 'azimut' ||
    fieldName === 'tilt' ||
    fieldName === 'hauteur_antenne' ||
    fieldName === 'puissance_dbm' ||
    fieldName === 'attenuation_db' ||
    fieldName === 'longueur_m' ||
    fieldName === 'niveau'
  ) {
    return 'number';
  }

  return 'text';
}

export function getFieldConfigs(table: EntityTableKey): FieldConfig[] {
  return schemaFields(table).map(name => ({
    name,
    label: humanizeFieldName(name),
    inputType: inferInputType(name),
    options: name === 'statut' ? STATUS_OPTIONS : undefined
  }));
}

export function getDisplayColumns(table: EntityTableKey, maxColumns = 4): string[] {
  const fields = schemaFields(table);
  return fields.slice(0, maxColumns);
}

export function createEmptyRecord(table: EntityTableKey): Record<string, string | number | null> {
  const record: Record<string, string | number | null> = {};

  for (const field of schemaFields(table)) {
    record[field] = inferInputType(field) === 'number' ? null : '';
  }

  return record;
}

export function formatFieldValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}
