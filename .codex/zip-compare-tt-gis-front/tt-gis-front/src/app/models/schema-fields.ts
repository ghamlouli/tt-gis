/**
 * Noms de colonnes alignés sur le schéma PostgreSQL TT GIS.
 * Utilisés pour l'affichage des champs dans les formulaires des modules.
 */
export const SCHEMA_FIELDS = {
  metro_ethernet: [
    'nom',
    'localisation',
    'capacite_totale_fo',
    'capacite_utilisee',
    'niveau',
    'vendor',
    'ip_gestion',
    'id_delegation'
  ],
  lien_fo: [
    'id_metro',
    'id_equipement',
    'type_equipement',
    'type_fo',
    'longueur_km',
    'nb_fibres',
    'attenuation_db',
    'date_pose',
    'statut'
  ],
  station_gsm: [
    'nom',
    'coord_x',
    'coord_y',
    'hba',
    'localisation',
    'statut',
    'date_mise_en_service',
    'id_delegation',
    'id_lien_fo'
  ],
  cellule_gsm: [
    'id_station',
    'nom_acces',
    'azimut',
    'tilt',
    'hauteur_antenne',
    'type_antenne',
    'puissance_dbm',
    'technologies',
    'bande_frequence'
  ],
  msan: [
    'nom',
    'coord_x',
    'coord_y',
    'localisation',
    'type_acces',
    'nb_lignes_total',
    'nb_lignes_attribuees',
    'nb_lignes_restantes',
    'vendor',
    'statut',
    'id_lien_fo'
  ],
  cable_cuivre: [
    'capacite_totale',
    'capacite_attribuee',
    'capacite_restante',
    'longueur_m',
    'type_cable',
    'zone_desserte'
  ],
  switch_outdoor: [
    'nom',
    'coord_x',
    'coord_y',
    'localisation_nom',
    'capacite_attribuee',
    'capacite_restante',
    'cout_restant',
    'modele',
    'vlan_ids',
    'statut',
    'date_installation',
    'id_lien_fo'
  ],
  lien_fh: [
    'nom_lien',
    'frequence_mhz',
    'capacite_mbps',
    'longueur_km',
    'azimut_a',
    'azimut_b',
    'type_modulation',
    'disponibilite_pct',
    'statut',
    'id_lien_fo'
  ],
  utilisateur: [
    'nom',
    'prenom',
    'email',
    'mot_de_passe',
    'telephone',
    'statut',
    'date_creation',
    'derniere_connexion'
  ],
  role: ['nom', 'description'],
  utilisateur_role: ['id_utilisateur', 'id_role', 'date_attribution']
} as const;

export function schemaFields(table: keyof typeof SCHEMA_FIELDS): string[] {
  return [...SCHEMA_FIELDS[table]];
}
