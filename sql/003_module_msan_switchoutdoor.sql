-- =====================================================================
-- Modules MSAN + SWITCHOUTDOOR — refonte radicale
-- À exécuter APRÈS 002_module_metroethernet_gsm.sql.
-- =====================================================================

BEGIN;

-- 1. Reconstruction de msan (plus de cable_cuivre, plus de lien_fo)
DROP TABLE IF EXISTS msan CASCADE;

CREATE TABLE msan (
    id_msan             SERIAL PRIMARY KEY,
    code                VARCHAR(30)  NOT NULL UNIQUE,
    nom                 VARCHAR(150) NOT NULL,
    id_delegation       INTEGER      NOT NULL REFERENCES delegation(id_delegation),
    coord_x             NUMERIC(10,6),
    coord_y             NUMERIC(10,6),
    capacite_raccordee  INTEGER      NOT NULL DEFAULT 0,
    capacite_occupee    INTEGER      NOT NULL DEFAULT 0,
    capacite_libre      INTEGER      GENERATED ALWAYS AS (capacite_raccordee - capacite_occupee) STORED,

    CONSTRAINT chk_msan_capacite CHECK (capacite_occupee <= capacite_raccordee)
);

-- 2. Reconstruction de switch_outdoor (plus de lien_fo, plus de vlan/modele/cout)
DROP TABLE IF EXISTS switch_outdoor CASCADE;

CREATE TABLE switch_outdoor (
    id_switch        SERIAL PRIMARY KEY,
    code             VARCHAR(30)  NOT NULL UNIQUE,
    nom              VARCHAR(150) NOT NULL,
    id_delegation    INTEGER      NOT NULL REFERENCES delegation(id_delegation),
    coord_x          NUMERIC(10,6),
    coord_y          NUMERIC(10,6),
    ports_attribues  INTEGER      NOT NULL DEFAULT 0,
    ports_occupes    INTEGER      NOT NULL DEFAULT 0,
    ports_libres     INTEGER      GENERATED ALWAYS AS (ports_attribues - ports_occupes) STORED,

    CONSTRAINT chk_switch_ports CHECK (ports_occupes <= ports_attribues)
);

COMMIT;
