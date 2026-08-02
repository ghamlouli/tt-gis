package com.gisttbackend.gisttbackend.specification;

import org.springframework.data.jpa.domain.Specification;

/**
 * Filtres génériques réutilisés par tous les tableaux de bord
 * (MetroEthernet, StationGSM, Msan, SwitchOutdoor, LienFH).
 *
 * Chaque filtre est indépendant et se combine librement avec les autres :
 *  - aucun filtre choisi                     -> tout s'affiche
 *  - gouvernorat seul                        -> tout ce qui est dans ce gouvernorat
 *  - gouvernorat + délégation                -> uniquement cette délégation
 *  - un attribut supplémentaire (ex: fournisseur GSM) seul, sans gouv/deleg
 *    -> tout ce qui correspond à cet attribut, quel que soit le lieu
 *  - toute combinaison des filtres ci-dessus en même temps
 *
 * Toutes les entités du domaine portent un champ "delegation" (ManyToOne
 * vers Delegation, elle-même reliée à Gouvernorat), donc ce même chemin
 * générique root.get("delegation")... fonctionne pour les 5 entités.
 */
public final class GeoFilterSpecifications {

    private GeoFilterSpecifications() {
    }

    public static <T> Specification<T> hasGouvernorat(Integer idGouv) {
        return (root, query, cb) -> idGouv == null
                ? cb.conjunction()
                : cb.equal(root.get("delegation").get("gouvernorat").get("idGouv"), idGouv);
    }

    public static <T> Specification<T> hasDelegation(Integer idDelegation) {
        return (root, query, cb) -> idDelegation == null
                ? cb.conjunction()
                : cb.equal(root.get("delegation").get("idDelegation"), idDelegation);
    }

    /** Filtre générique sur un champ texte simple (ex: fournisseur GSM), insensible à la casse. */
    public static <T> Specification<T> hasTextField(String fieldName, String value) {
        return (root, query, cb) -> (value == null || value.isBlank())
                ? cb.conjunction()
                : cb.equal(cb.upper(root.get(fieldName)), value.trim().toUpperCase());
    }

    /** Combine gouvernorat + délégation en une seule spec, prête à être complétée avec .and(...). */
    public static <T> Specification<T> geo(Integer idGouv, Integer idDelegation) {
        return Specification.<T>where(hasGouvernorat(idGouv)).and(hasDelegation(idDelegation));
    }
}