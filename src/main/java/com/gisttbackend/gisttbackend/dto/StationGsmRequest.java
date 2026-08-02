package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class StationGsmRequest {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le nom du site est obligatoire")
    private String nom;

    @NotNull(message = "Le gouvernorat/délégation est obligatoire")
    private Integer idDelegation;

    private BigDecimal coordX;
    private BigDecimal coordY;

    @NotEmpty(message = "Au moins une technologie doit être sélectionnée")
    private List<@Pattern(regexp = "^(2G|3G|4G|5G)$", message = "Technologie invalide") String> technologies;

    @NotBlank(message = "Le fournisseur est obligatoire")
    @Pattern(regexp = "^(Huawei|Ericsson)$", message = "Fournisseur invalide")
    private String fournisseur;
}
