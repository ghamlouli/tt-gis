package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.Delegation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DelegationRepository extends JpaRepository<Delegation, Integer> {
    List<Delegation> findByGouvernoratIdGouv(Integer idGouv);
}