export type Profil = 'Ingenieur' | 'Admin' | 'Fournisseur' | 'Client' | 'Gerant';

export const PROFILS: Profil[] = ['Ingenieur', 'Admin', 'Fournisseur', 'Client', 'Gerant'];

export type SessionUser = {
  login: string;
  nom: string;
  prenom: string;
  matricule: string;
  profil: Profil;
};

export type RegisterPayload = {
  matricule: string;
  nom: string;
  prenom: string;
  profil: Profil;
  login: string;
  motDePasse: string;
  confirmMotDePasse: string;
};

export type ForgotPasswordPayload = {
  login: string;
  matricule: string;
  nom: string;
  prenom: string;
  profil: Profil;
  motDePasse: string;
  confirmMotDePasse: string;
};

export type AuthResult =
  | { success: true }
  | { success: false; message: string };
