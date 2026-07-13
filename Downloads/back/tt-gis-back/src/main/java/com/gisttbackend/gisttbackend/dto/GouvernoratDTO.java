package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GouvernoratDTO {
    private Integer idGouv;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    private String code;
}