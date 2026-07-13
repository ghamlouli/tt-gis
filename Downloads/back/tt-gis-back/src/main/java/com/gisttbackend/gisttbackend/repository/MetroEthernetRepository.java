package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.MetroEthernet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MetroEthernetRepository extends JpaRepository<MetroEthernet, Integer>, JpaSpecificationExecutor<MetroEthernet> {
    boolean existsByCode(String code);
}