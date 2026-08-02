package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MetroEthernetRequest {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotNull(message = "Le gouvernorat/délégation est obligatoire")
    private Integer idDelegation;

    private BigDecimal coordX;
    private BigDecimal coordY;

    private String ipGestion;

    @NotNull(message = "Les ports raccordés sont obligatoires")
    private Integer portsRaccordes;

    @NotNull(message = "Les ports occupés sont obligatoires")
    private Integer portsOccupes;
}
