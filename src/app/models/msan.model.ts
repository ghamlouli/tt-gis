export type Msan = {
  idMsan?: number;
  code: string;
  nom: string;
  idDelegation: number;
  delegation?: string;
  gouvernorat?: string;
  coordX?: number | null;
  coordY?: number | null;
  capaciteRaccordee: number;
  capaciteOccupee: number;
  capaciteLibre?: number;
};
