package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.SwitchOutdoor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SwitchOutdoorRepository extends JpaRepository<SwitchOutdoor, Integer>, JpaSpecificationExecutor<SwitchOutdoor> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdSwitchNot(String code, Integer idSwitch);
}