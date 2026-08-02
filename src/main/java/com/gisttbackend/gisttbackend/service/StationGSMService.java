package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.StationGsmRequest;
import com.gisttbackend.gisttbackend.dto.StationGsmResponse;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.StationGSM;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.StationGSMRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationGSMService {

    private final StationGSMRepository stationGSMRepository;
    private final DelegationRepository delegationRepository;

    @Transactional
    public StationGsmResponse create(StationGsmRequest request) {
        if (stationGSMRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        StationGSM entity = new StationGSM();
        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setTechnologies(request.getTechnologies());
        entity.setFournisseur(request.getFournisseur());

        return toResponse(stationGSMRepository.save(entity));
    }


    @Transactional(readOnly = true)
    public List<StationGsmResponse> findAll(Integer idGouv, Integer idDelegation, String fournisseur) {
        Specification<StationGSM> spec = GeoFilterSpecifications.<StationGSM>geo(idGouv, idDelegation)
                .and(GeoFilterSpecifications.hasTextField("fournisseur", fournisseur));

        return stationGSMRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional
    public StationGsmResponse update(Integer id, StationGsmRequest request) {
        StationGSM entity = stationGSMRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Site GSM introuvable"));

        if (stationGSMRepository.existsByCodeAndIdStationNot(request.getCode(), id)) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setTechnologies(request.getTechnologies());
        entity.setFournisseur(request.getFournisseur());

        return toResponse(stationGSMRepository.save(entity));
    }

    @Transactional
    public void delete(Integer id) {
        if (!stationGSMRepository.existsById(id)) {
            throw new IllegalArgumentException("Site GSM introuvable");
        }
        stationGSMRepository.deleteById(id);
    }

    private StationGsmResponse toResponse(StationGSM e) {
        return new StationGsmResponse(
                e.getIdStation(),
                e.getCode(),
                e.getNom(),
                e.getDelegation().getIdDelegation(),
                e.getDelegation().getNom(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getTechnologies(),
                e.getFournisseur()
        );
    }
}