package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationGsmResponse {
    private Integer idStation;
    private String code;
    private String nom;
    private Integer idDelegation;
    private String delegation;
    private String gouvernorat;
    private BigDecimal coordX;
    private BigDecimal coordY;
    private List<String> technologies;
    private String fournisseur;
}
