package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.SwitchOutdoorRequest;
import com.gisttbackend.gisttbackend.dto.SwitchOutdoorResponse;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.SwitchOutdoor;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.SwitchOutdoorRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SwitchOutdoorService {

    private final SwitchOutdoorRepository switchOutdoorRepository;
    private final DelegationRepository delegationRepository;

    @Transactional
    public SwitchOutdoorResponse create(SwitchOutdoorRequest request) {
        if (switchOutdoorRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }
        if (request.getPortsOccupes() > request.getPortsAttribues()) {
            throw new IllegalArgumentException("Les ports occupés ne peuvent pas dépasser les ports attribués");
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        SwitchOutdoor entity = new SwitchOutdoor();
        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setPortsAttribues(request.getPortsAttribues());
        entity.setPortsOccupes(request.getPortsOccupes());

        SwitchOutdoor saved = switchOutdoorRepository.save(entity);
        return toResponse(switchOutdoorRepository.findById(saved.getIdSwitch()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<SwitchOutdoorResponse> findAll(Integer idGouv, Integer idDelegation) {
        var spec = GeoFilterSpecifications.<SwitchOutdoor>geo(idGouv, idDelegation);
        return switchOutdoorRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(Integer id) {
        if (!switchOutdoorRepository.existsById(id)) {
            throw new IllegalArgumentException("Switch outdoor introuvable");
        }
        switchOutdoorRepository.deleteById(id);
    }

    private SwitchOutdoorResponse toResponse(SwitchOutdoor e) {
        return new SwitchOutdoorResponse(
                e.getIdSwitch(),
                e.getCode(),
                e.getNom(),
                e.getDelegation().getIdDelegation(),
                e.getDelegation().getNom(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getPortsAttribues(),
                e.getPortsOccupes(),
                e.getPortsLibres()
        );
    }
}