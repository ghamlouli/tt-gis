package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.StationGSM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StationGSMRepository extends JpaRepository<StationGSM, Integer>, JpaSpecificationExecutor<StationGSM> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdStationNot(String code, Integer idStation);
}