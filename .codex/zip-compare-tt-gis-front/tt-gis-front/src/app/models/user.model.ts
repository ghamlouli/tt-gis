export type UserRole = 'CLIENT' | 'INGENIEUR' | 'GERANT' | 'ADMIN';

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'CLIENT',
    label: 'Client',
    description: 'Consultation des modules et tableaux de bord'
  },
  {
    value: 'INGENIEUR',
    label: 'Ingénieur',
    description: 'Gestion technique des équipements réseau'
  },
  {
    value: 'GERANT',
    label: 'Gérant',
    description: 'Supervision, validation et pilotage des modules'
  },
  {
    value: 'ADMIN',
    label: 'Administrateur',
    description: 'Administration complète de la plateforme'
  }
];

export function getRoleLabel(role: UserRole | string): string {
  return ROLE_OPTIONS.find(option => option.value === role)?.label ?? String(role);
}

export type UserStatistics = {
  modules_accessibles?: number;
  consultations_mois?: number;
  interventions_mois?: number;
  validations_mois?: number;
  utilisateurs_geres?: number;
  derniere_connexion?: string;
};

export type User = {
  id_utilisateur: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone?: string;
  statut: string;
  roles: UserRole[];
  statistiques?: UserStatistics;
};

export type SessionUser = Omit<User, 'mot_de_passe'>;

export type AuthResult =
  | { success: true; user: SessionUser }
  | { success: false; message: string };

export type SignUpPayload = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  role: UserRole;
};
