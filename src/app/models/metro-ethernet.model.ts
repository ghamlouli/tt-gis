export type MetroEthernet = {
  idMetro?: number;
  code: string;
  nom: string;
  idDelegation: number;
  delegation?: string;
  gouvernorat?: string;
  coordX?: number | null;
  coordY?: number | null;
  ipGestion?: string;
  portsRaccordes: number;
  portsOccupes: number;
  portsLibres?: number;
};
