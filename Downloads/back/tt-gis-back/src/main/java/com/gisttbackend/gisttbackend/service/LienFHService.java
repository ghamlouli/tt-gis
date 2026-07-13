package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.LienFHRequest;
import com.gisttbackend.gisttbackend.dto.LienFHResponse;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.LienFH;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.LienFHRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LienFHService {

    private final LienFHRepository lienFHRepository;
    private final DelegationRepository delegationRepository;

    @Transactional
    public LienFHResponse create(LienFHRequest request) {
        if (lienFHRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Ce code existe déjà : " + request.getCode());
        }

        Delegation delegation = delegationRepository.findById(request.getIdDelegation())
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable"));

        LienFH entity = new LienFH();
        entity.setCode(request.getCode());
        entity.setNom(request.getNom());
        entity.setDelegation(delegation);
        entity.setCoordX(request.getCoordX());
        entity.setCoordY(request.getCoordY());

        return toResponse(lienFHRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<LienFHResponse> findAll(Integer idGouv, Integer idDelegation) {
        var spec = GeoFilterSpecifications.<LienFH>geo(idGouv, idDelegation);
        return lienFHRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(Integer id) {
        if (!lienFHRepository.existsById(id)) {
            throw new IllegalArgumentException("Lien FH introuvable");
        }
        lienFHRepository.deleteById(id);
    }

    private LienFHResponse toResponse(LienFH e) {
        return new LienFHResponse(
                e.getIdFh(),
                e.getCode(),
                e.getNom(),
                e.getDelegation().getIdDelegation(),
                e.getDelegation().getNom(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getCoordX(),
                e.getCoordY()
        );
    }
}