-- =====================================================================
-- Modules METROETHERNET + GSM — refonte radicale
-- À exécuter APRÈS 001_module_auth.sql, sur Supabase ET Postgres local.
-- =====================================================================

BEGIN;

-- 1. Suppression des entités hors périmètre (non mentionnées dans le cahier
--    des charges) : documentation_gsm, client_radio, cable_cuivre.
--    cable_cuivre référence msan -> on la supprime seule, msan n'est pas
--    touchée ici (module MSAN à venir).
DROP TABLE IF EXISTS documentation_gsm CASCADE;
DROP TABLE IF EXISTS client_radio CASCADE;
DROP TABLE IF EXISTS cable_cuivre CASCADE;

-- 2. Suppression de cellule_gsm : les technologies (2G/3G/4G/5G) sont
--    désormais portées directement par station_gsm (un seul niveau,
--    pas de sous-cellule).
DROP TABLE IF EXISTS cellule_gsm CASCADE;

-- 3. Reconstruction de metro_ethernet
DROP TABLE IF EXISTS metro_ethernet CASCADE;

CREATE TABLE metro_ethernet (
    id_metro        SERIAL PRIMARY KEY,
    code            VARCHAR(30)  NOT NULL UNIQUE,
    nom             VARCHAR(150) NOT NULL,
    id_delegation   INTEGER      NOT NULL REFERENCES delegation(id_delegation),
    coord_x         NUMERIC(10,6),
    coord_y         NUMERIC(10,6),
    ip_gestion      VARCHAR(45),
    ports_raccordes INTEGER      NOT NULL DEFAULT 0,
    ports_occupes   INTEGER      NOT NULL DEFAULT 0,
    ports_libres    INTEGER      GENERATED ALWAYS AS (ports_raccordes - ports_occupes) STORED,

    CONSTRAINT chk_me_ports CHECK (ports_occupes <= ports_raccordes)
);

-- 4. Reconstruction de station_gsm (site GSM)
DROP TABLE IF EXISTS station_gsm CASCADE;

CREATE TABLE station_gsm (
    id_station      SERIAL PRIMARY KEY,
    code            VARCHAR(30)  NOT NULL UNIQUE,
    nom             VARCHAR(150) NOT NULL,
    id_delegation   INTEGER      NOT NULL REFERENCES delegation(id_delegation),
    coord_x         NUMERIC(10,6),
    coord_y         NUMERIC(10,6),
    -- Choix multiples parmi 2G / 3G / 4G / 5G
    technologies    TEXT[]       NOT NULL DEFAULT '{}',
    fournisseur     VARCHAR(20)  NOT NULL
                      CHECK (fournisseur IN ('Huawei','Ericsson')),

    CONSTRAINT chk_gsm_technologies CHECK (
        technologies <@ ARRAY['2G','3G','4G','5G']::TEXT[]
    )
);

COMMIT;
