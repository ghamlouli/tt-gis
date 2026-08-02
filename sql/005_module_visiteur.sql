-- =====================================================================
-- Module VISITEUR
-- Création de la table visiteur avec : cin, nom, prenom
-- =====================================================================

BEGIN;

-- Création de la table visiteur
DROP TABLE IF EXISTS visiteur CASCADE;

CREATE TABLE visiteur (
    id_visiteur   SERIAL PRIMARY KEY,
    cin           VARCHAR(20)  NOT NULL UNIQUE,
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    coordX        DOUBLE PRECISION,
    coordY        DOUBLE PRECISION,
    delegation    VARCHAR(100),
    gouvernorat   VARCHAR(100)
);

CREATE INDEX idx_visiteur_cin ON visiteur (cin);

COMMIT;
