export type Technologie = '2G' | '3G' | '4G' | '5G';
export const TECHNOLOGIES: Technologie[] = ['2G', '3G', '4G', '5G'];

export type Fournisseur = 'Huawei' | 'Ericsson';
export const FOURNISSEURS: Fournisseur[] = ['Huawei', 'Ericsson'];

export type StationGsm = {
  idStation?: number;
  code: string;
  nom: string;
  idDelegation: number;
  delegation?: string;
  gouvernorat?: string;
  coordX?: number | null;
  coordY?: number | null;
  technologies: Technologie[];
  fournisseur: Fournisseur;
};
