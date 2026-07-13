package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Le matricule est obligatoire")
    @Pattern(regexp = "^[0-9]+$", message = "Le matricule ne doit contenir que des chiffres")
    private String matricule;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le profil est obligatoire")
    @Pattern(regexp = "^(Ingenieur|Admin|Fournisseur|Client|Gerant)$",
             message = "Profil invalide")
    private String profil;

    @NotBlank(message = "Le login est obligatoire")
    @Pattern(regexp = "^\\S+$", message = "Le login ne doit contenir aucun espace")
    private String login;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "La confirmation du mot de passe est obligatoire")
    private String confirmMotDePasse;
}
