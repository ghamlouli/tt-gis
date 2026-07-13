package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.Visiteur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisiteurRepository extends JpaRepository<Visiteur, Integer> {
    Optional<Visiteur> findByCin(String cin);
    boolean existsByCin(String cin);
}
