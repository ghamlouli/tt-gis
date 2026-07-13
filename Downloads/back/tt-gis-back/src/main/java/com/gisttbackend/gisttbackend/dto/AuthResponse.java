package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String login;
    private String nom;
    private String prenom;
    private String matricule;
    private String profil;
}
