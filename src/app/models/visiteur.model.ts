export interface Visiteur {
  id?: number;
  cin: string;
  nom: string;
  prenom: string;
  coordX: number | null;
  coordY: number | null;
  delegation?: string;
  gouvernorat?: string;
}
