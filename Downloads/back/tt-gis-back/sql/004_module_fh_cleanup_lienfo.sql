-- =====================================================================
-- Module FH — refonte radicale + nettoyage final de lien_fo
-- À exécuter APRÈS 003_module_msan_switchoutdoor.sql.
-- =====================================================================

BEGIN;

-- 1. Reconstruction de lien_fh (plus de fréquence/capacité/modulation/etc.,
--    non demandées : uniquement code, nom, gouv, deleg, x, y)
DROP TABLE IF EXISTS lien_fh CASCADE;

CREATE TABLE lien_fh (
    id_fh           SERIAL PRIMARY KEY,
    code            VARCHAR(30)  NOT NULL UNIQUE,
    nom             VARCHAR(150) NOT NULL,
    id_delegation   INTEGER      NOT NULL REFERENCES delegation(id_delegation),
    coord_x         NUMERIC(10,6),
    coord_y         NUMERIC(10,6)
);

-- 2. lien_fh était la dernière table dépendant de lien_fo : suppression
--    définitive de ce pivot générique, qui n'existe plus dans le cahier
--    des charges (chaque équipement porte désormais ses propres ports).
DROP TABLE IF EXISTS lien_fo CASCADE;

COMMIT;
