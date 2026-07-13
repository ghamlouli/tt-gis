package com.gisttbackend.gisttbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Formulaire de récupération de mot de passe : identique au formulaire
 * de création de compte, pré-rempli à partir du login déjà saisi sur la
 * page de connexion. Seuls le matricule (non modifiable) et les deux
 * champs mot de passe restent vides.
 */
@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Le login est obligatoire")
    private String login;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le profil est obligatoire")
    @Pattern(regexp = "^(Ingenieur|Admin|Fournisseur|Client|Gerant)$",
             message = "Profil invalide")
    private String profil;

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "La confirmation du mot de passe est obligatoire")
    private String confirmMotDePasse;
}
