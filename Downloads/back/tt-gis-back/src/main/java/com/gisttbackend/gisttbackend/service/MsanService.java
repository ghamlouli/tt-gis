package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.MsanRequest;
import com.gisttbackend.gisttbackend.dto.MsanResponse;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.Msan;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.MsanRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MsanService {

    private final MsanRepository msanRepository;
    private final DelegationRepository delegationRepository;

    @Transactional
    public MsanResponse create(MsanRequest request) {
        if (msanRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }
        if (request.getCapaciteOccupee() > request.getCapaciteRaccordee()) {
            throw new IllegalArgumentException("La capacité occupée ne peut pas dépasser la capacité raccordée");
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        Msan entity = new Msan();
        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());
        entity.setCapaciteRaccordee(request.getCapaciteRaccordee());
        entity.setCapaciteOccupee(request.getCapaciteOccupee());

        Msan saved = msanRepository.save(entity);
        return toResponse(msanRepository.findById(saved.getIdMsan()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<MsanResponse> findAll(Integer idGouv, Integer idDelegation) {
        var spec = GeoFilterSpecifications.<Msan>geo(idGouv, idDelegation);
        return msanRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(Integer id) {
        if (!msanRepository.existsById(id)) {
            throw new IllegalArgumentException("MSAN introuvable");
        }
        msanRepository.deleteById(id);
    }

    private MsanResponse toResponse(Msan e) {
        return new MsanResponse(
                e.getIdMsan(),
                e.getCode(),
                e.getNom(),
                e.getDelegation().getIdDelegation(),
                e.getDelegation().getNom(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getCapaciteRaccordee(),
                e.getCapaciteOccupee(),
                e.getCapaciteLibre()
        );
    }
}