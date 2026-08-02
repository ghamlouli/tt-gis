# Backend tt-gis — livraison complète (prêt à exécuter)

Ce zip contient l'intégralité du backend Spring Boot avec TOUTES les
modifications radicales appliquées (Auth, MetroEthernet, GSM, MSAN,
SwitchOutdoor, FH, GIS Cloud), et tout ce qui n'était pas dans le cahier
des charges déjà supprimé (Role, CableCuivre, ClientRadio,
DocumentationGSM, CelluleGSM, LienFO).

## 1) Base de données — à exécuter D'ABORD, dans l'ordre, sur Supabase ET
   sur ton Postgres local :

    sql/000_seed_gouvernorats_delegations.sql
    sql/001_module_auth.sql
    sql/002_module_metroethernet_gsm.sql
    sql/003_module_msan_switchoutdoor.sql
    sql/004_module_fh_cleanup_lienfo.sql

## 2) Remplacer ton dossier backend actuel par le contenu de ce zip
   (ou remplacer uniquement src/, pom.xml, mvnw si tu préfères garder
   ton .git existant).

## 3) Vérifier application.properties (URL Supabase / Postgres local,
   jwt.secret, jwt.expiration) — non modifié par cette livraison.

## 4) Lancer :

    ./mvnw spring-boot:run

Le backend démarre sur le port 8081, comme avant.

## Endpoints exposés

- POST /api/auth/register
- POST /api/auth/login
- PUT  /api/auth/forgot-password
- GET  /api/auth/lookup/{login}

- GET/POST/DELETE /api/metroethernets   (filtres idGouv, idDelegation)
- GET/POST/DELETE /api/stations-gsm     (filtres idGouv, idDelegation, fournisseur)
- GET/POST/DELETE /api/msan             (filtres idGouv, idDelegation)
- GET/POST/DELETE /api/switch-outdoor   (filtres idGouv, idDelegation)
- GET/POST/DELETE /api/liens-fh         (filtres idGouv, idDelegation)
- GET /api/gis-cloud                    (filtres idGouv, idDelegation, acces)

- GET /api/gouvernorats
- GET /api/delegations/gouvernorat/{idGouv}

## Entités restantes (tout le reste a été supprimé)

Utilisateur, Gouvernorat, Delegation, MetroEthernet, StationGSM, Msan,
SwitchOutdoor, LienFH.
