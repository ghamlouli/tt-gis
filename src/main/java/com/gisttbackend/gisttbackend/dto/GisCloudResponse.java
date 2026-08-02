package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GisCloudResponse {
    private String acces;
    private String nom;
    private BigDecimal coordX;
    private BigDecimal coordY;
    private String gouvernorat;
    private String delegation;
    private Integer portsLibres;
    private List<String> technologies;
}
