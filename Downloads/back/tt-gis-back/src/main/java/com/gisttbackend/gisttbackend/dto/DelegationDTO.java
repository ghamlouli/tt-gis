package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DelegationDTO {
    private Integer idDelegation;

    @NotNull(message = "Le gouvernorat est obligatoire")
    private Integer idGouv;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    private String code;
}