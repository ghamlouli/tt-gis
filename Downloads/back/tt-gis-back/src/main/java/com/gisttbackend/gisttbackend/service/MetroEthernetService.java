package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.MetroEthernetRequest;
import com.gisttbackend.gisttbackend.dto.MetroEthernetResponse;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.MetroEthernet;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.MetroEthernetRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetroEthernetService {

    private final MetroEthernetRepository metroEthernetRepository;
    private final DelegationRepository delegationRepository;

    @Transactional
    public MetroEthernetResponse create(MetroEthernetRequest request) {
        if (metroEthernetRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }
        if (request.getPortsOccupes() > request.getPortsRaccordes()) {
            throw new IllegalArgumentException("Les ports occupés ne peuvent pas dépasser les ports raccordés");
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        MetroEthernet entity = new MetroEthernet();
        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setIpGestion(request.getIpGestion());
        entity.setPortsRaccordes(request.getPortsRaccordes());
        entity.setPortsOccupes(request.getPortsOccupes());

        MetroEthernet saved = metroEthernetRepository.save(entity);
        // re-fetch pour récupérer la colonne générée ports_libres
        return toResponse(metroEthernetRepository.findById(saved.getIdMetro()).orElseThrow());
    }

    /**
     * Affichage conditionné flexible : gouvernorat seul -> tout ce
     * gouvernorat ; gouvernorat + délégation -> uniquement cette
     * délégation ; aucun filtre -> tout s'affiche.
     */
    @Transactional(readOnly = true)
    public List<MetroEthernetResponse> findAll(Integer idGouv, Integer idDelegation) {
        var spec = GeoFilterSpecifications.<MetroEthernet>geo(idGouv, idDelegation);
        return metroEthernetRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional
    public MetroEthernetResponse update(Integer id, MetroEthernetRequest request) {
        System.out.println("=== UPDATE METRO ETHERNET ===");
        System.out.println("ID: " + id);
        System.out.println("Code: " + request.getCode());
        System.out.println("CoordX: " + request.getCoordX());
        System.out.println("CoordY: " + request.getCoordY());
        System.out.println("IdDelegation: " + request.getIdDelegation());

        MetroEthernet entity = metroEthernetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MetroEthernet introuvable"));

        if (metroEthernetRepository.existsByCodeAndIdMetroNot(request.getCode(), id)) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }

        if (request.getPortsOccupes() > request.getPortsRaccordes()) {
            throw new IllegalArgumentException("Les ports occupés ne peuvent pas dépasser les ports raccordés");
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setIpGestion(request.getIpGestion());
        entity.setPortsRaccordes(request.getPortsRaccordes());
        entity.setPortsOccupes(request.getPortsOccupes());

        MetroEthernet saved = metroEthernetRepository.save(entity);
        return toResponse(metroEthernetRepository.findById(saved.getIdMetro()).orElseThrow());
    }

    @Transactional
    public void delete(Integer id) {
        if (!metroEthernetRepository.existsById(id)) {
            throw new IllegalArgumentException("MetroEthernet introuvable");
        }
        metroEthernetRepository.deleteById(id);
    }

    private MetroEthernetResponse toResponse(MetroEthernet e) {
        return new MetroEthernetResponse(
                e.getIdMetro(),
                e.getCode(),
                e.getNom(),
                e.getDelegation().getIdDelegation(),
                e.getDelegation().getNom(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getIpGestion(),
                e.getPortsRaccordes(),
                e.getPortsOccupes(),
                e.getPortsLibres()
        );
    }
}