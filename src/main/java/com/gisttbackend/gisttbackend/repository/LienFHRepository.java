package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.LienFH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LienFHRepository extends JpaRepository<LienFH, Integer>, JpaSpecificationExecutor<LienFH> {
    boolean existsByCode(String code);
}