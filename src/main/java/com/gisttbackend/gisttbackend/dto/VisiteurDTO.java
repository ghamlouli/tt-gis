package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VisiteurDTO {
    private Integer idVisiteur;

    @NotBlank(message = "Le CIN est obligatoire")
    private String cin;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    private Double coordX;
    private Double coordY;

    private String delegation;
    private String gouvernorat;
}
