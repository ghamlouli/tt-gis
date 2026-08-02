export type AccesType = 'GSM' | 'FO' | 'MSAN';

export const ACCES_TYPES: { value: AccesType; label: string }[] = [
  { value: 'GSM', label: 'GSM' },
  { value: 'FO', label: 'FO (SwitchOutdoor)' },
  { value: 'MSAN', label: 'MSAN' }
];

export type GisCloudRow = {
  acces: AccesType;
  nom: string;
  coordX: number | null;
  coordY: number | null;
  gouvernorat: string;
  delegation: string;
  portsLibres: number | null;
  technologies: string[];
};
