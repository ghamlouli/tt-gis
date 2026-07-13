package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.DelegationDTO;
import com.gisttbackend.gisttbackend.entity.Delegation;
import com.gisttbackend.gisttbackend.entity.Gouvernorat;
import com.gisttbackend.gisttbackend.repository.DelegationRepository;
import com.gisttbackend.gisttbackend.repository.GouvernoratRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DelegationService {

    private final DelegationRepository repository;
    private final GouvernoratRepository gouvernoratRepository;

    public List<DelegationDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DelegationDTO findById(Integer id) {
        return toDTO(getEntity(id));
    }

    public List<DelegationDTO> findByGouvernorat(Integer idGouv) {
        return repository.findByGouvernoratIdGouv(idGouv).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public DelegationDTO create(DelegationDTO dto) {
        Delegation entity = new Delegation();
        applyDTO(entity, dto);
        return toDTO(repository.save(entity));
    }

    @Transactional
    public DelegationDTO update(Integer id, DelegationDTO dto) {
        Delegation entity = getEntity(id);
        applyDTO(entity, dto);
        return toDTO(repository.save(entity));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Délégation introuvable : id=" + id);
        }
        repository.deleteById(id);
    }

    private Delegation getEntity(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Délégation introuvable : id=" + id));
    }

    private void applyDTO(Delegation entity, DelegationDTO dto) {
        Gouvernorat gouvernorat = gouvernoratRepository.findById(dto.getIdGouv())
                .orElseThrow(() -> new IllegalArgumentException("Gouvernorat introuvable : id=" + dto.getIdGouv()));
        entity.setGouvernorat(gouvernorat);
        entity.setNom(dto.getNom());
        entity.setCode(dto.getCode());
    }

    private DelegationDTO toDTO(Delegation entity) {
        DelegationDTO dto = new DelegationDTO();
        dto.setIdDelegation(entity.getIdDelegation());
        dto.setIdGouv(entity.getGouvernorat().getIdGouv());
        dto.setNom(entity.getNom());
        dto.setCode(entity.getCode());
        return dto;
    }
}