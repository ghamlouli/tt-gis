package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByLogin(String login);
    boolean existsByLogin(String login);
    boolean existsByMatricule(String matricule);
}
