export type SwitchOutdoor = {
  idSwitch?: number;
  code: string;
  nom: string;
  idDelegation: number;
  delegation?: string;
  gouvernorat?: string;
  coordX?: number | null;
  coordY?: number | null;
  portsAttribues: number;
  portsOccupes: number;
  portsLibres?: number;
};
