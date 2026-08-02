-- =====================================================================
-- Module AUTHENTIFICATION — refonte radicale
-- Supprime le système de rôles (table role / utilisateur_role) et
-- reconstruit la table utilisateur avec : matricule, nom, prenom,
-- profil, login (unique), mot_de_passe.
-- À exécuter sur Supabase (jhrlrzgbwebpapyavhky) ET sur le Postgres local.
-- =====================================================================

BEGIN;

-- 1. Suppression du système de rôles (remplacé par la colonne "profil")
DROP TABLE IF EXISTS utilisateur_role CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- 2. Reconstruction de la table utilisateur
DROP TABLE IF EXISTS utilisateur CASCADE;

CREATE TABLE utilisateur (
    id_utilisateur   SERIAL PRIMARY KEY,
    matricule        VARCHAR(20)  NOT NULL UNIQUE,
    nom              VARCHAR(100) NOT NULL,
    prenom           VARCHAR(100) NOT NULL,
    profil           VARCHAR(20)  NOT NULL
                       CHECK (profil IN ('Ingenieur','Admin','Fournisseur','Client','Gerant')),
    login            VARCHAR(50)  NOT NULL UNIQUE,
    mot_de_passe     VARCHAR(255) NOT NULL,
    date_creation    TIMESTAMP    NOT NULL DEFAULT NOW(),

    -- Le matricule ne doit être composé que de chiffres
    CONSTRAINT chk_matricule_numerique CHECK (matricule ~ '^[0-9]+$'),
    -- Le login ne doit contenir aucun espace
    CONSTRAINT chk_login_sans_espace CHECK (login !~ '\s')
);

CREATE INDEX idx_utilisateur_login ON utilisateur (login);

COMMIT;
