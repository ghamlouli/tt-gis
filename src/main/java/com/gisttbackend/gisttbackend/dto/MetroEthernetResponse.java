package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetroEthernetResponse {
    private Integer idMetro;
    private String code;
    private String nom;
    private Integer idDelegation;
    private String delegation;
    private String gouvernorat;
    private BigDecimal coordX;
    private BigDecimal coordY;
    private String ipGestion;
    private Integer portsRaccordes;
    private Integer portsOccupes;
    private Integer portsLibres;
}
