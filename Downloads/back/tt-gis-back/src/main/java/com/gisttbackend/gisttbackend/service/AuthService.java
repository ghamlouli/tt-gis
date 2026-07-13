package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.*;
import com.gisttbackend.gisttbackend.entity.Utilisateur;
import com.gisttbackend.gisttbackend.repository.UtilisateurRepository;
import com.gisttbackend.gisttbackend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        if (!request.getMotDePasse().equals(request.getConfirmMotDePasse())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }
        if (utilisateurRepository.existsByLogin(request.getLogin())) {
            throw new IllegalArgumentException("Ce login est déjà utilisé : " + request.getLogin());
        }
        if (utilisateurRepository.existsByMatricule(request.getMatricule())) {
            throw new IllegalArgumentException("Ce matricule est déjà utilisé : " + request.getMatricule());
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setMatricule(request.getMatricule());
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setProfil(request.getProfil());
        utilisateur.setLogin(request.getLogin());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setDateCreation(LocalDateTime.now());

        utilisateurRepository.save(utilisateur);

        return new RegisterResponse("Compte créé avec succès", utilisateur.getLogin());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getLogin(), request.getMotDePasse())
            );
        } catch (BadCredentialsException ex) {
            throw new IllegalArgumentException("Mot de passe incorrecte, réessayer");
        }

        Utilisateur utilisateur = utilisateurRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new IllegalArgumentException("Mot de passe incorrecte, réessayer"));

        String token = jwtService.generateToken(utilisateur);

        return new AuthResponse(
                token,
                utilisateur.getLogin(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getMatricule(),
                utilisateur.getProfil()
        );
    }

    /**
     * Utilisé pour pré-remplir le formulaire de récupération de mot de
     * passe à partir du login déjà saisi sur la page de connexion.
     */
    @Transactional(readOnly = true)
    public ProfileLookupResponse lookupByLogin(String login) {
        Utilisateur utilisateur = utilisateurRepository.findByLogin(login)
                .orElseThrow(() -> new IllegalArgumentException("Aucun compte pour ce login : " + login));
        return new ProfileLookupResponse(
                utilisateur.getLogin(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getProfil()
        );
    }

    /**
     * Récupération de mot de passe : identifie le compte par son login,
     * met à jour nom/prenom/profil (repris du formulaire pré-rempli) et
     * remplace le mot de passe. Le matricule n'est jamais modifié ici.
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {

        if (!request.getMotDePasse().equals(request.getConfirmMotDePasse())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }

        Utilisateur utilisateur = utilisateurRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new IllegalArgumentException("Aucun compte pour ce login : " + request.getLogin()));

        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setProfil(request.getProfil());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));

        utilisateurRepository.save(utilisateur);
    }
}
