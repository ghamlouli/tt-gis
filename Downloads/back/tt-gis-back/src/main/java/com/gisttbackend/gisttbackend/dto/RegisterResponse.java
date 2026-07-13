package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Réponse à l'inscription. Pas de token : après validation, l'utilisateur
 * est redirigé vers la page de connexion (pas de connexion automatique).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private String message;
    private String login;
}
