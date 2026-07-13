package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Ligne unifiée pour le module GIS Cloud (collecte de données +
 * visualisation), qui agrège MetroEthernet, StationGSM, Msan et
 * SwitchOutdoor (FO) sous un même format.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GisCloudResponse {
    /** Type d'accès : MetroEthernet, GSM, FO (switchoutdoor) ou MSAN */
    private String acces;
    private String nom;
    private BigDecimal coordX;
    private BigDecimal coordY;
    private String gouvernorat;
    private String delegation;
    private Integer portsLibres;
    /** Uniquement renseigné pour les sites GSM, vide sinon */
    private List<String> technologies;
}
