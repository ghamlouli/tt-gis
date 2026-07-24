package com.gisttbackend.gisttbackend.repository;

import com.gisttbackend.gisttbackend.entity.Msan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MsanRepository extends JpaRepository<Msan, Integer>, JpaSpecificationExecutor<Msan> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdMsanNot(String code, Integer idMsan);
}