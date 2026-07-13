package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MsanRequest {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotNull(message = "Le gouvernorat/délégation est obligatoire")
    private Integer idDelegation;

    private BigDecimal coordX;
    private BigDecimal coordY;

    @NotNull(message = "La capacité raccordée est obligatoire")
    private Integer capaciteRaccordee;

    @NotNull(message = "La capacité occupée est obligatoire")
    private Integer capaciteOccupee;
}
