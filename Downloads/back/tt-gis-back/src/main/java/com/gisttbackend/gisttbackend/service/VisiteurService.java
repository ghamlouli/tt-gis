package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.VisiteurDTO;
import com.gisttbackend.gisttbackend.entity.Visiteur;
import com.gisttbackend.gisttbackend.repository.VisiteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisiteurService {

    private final VisiteurRepository repository;

    public List<VisiteurDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public VisiteurDTO findById(Integer id) {
        Visiteur entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visiteur introuvable : id=" + id));
        return toDTO(entity);
    }

    @Transactional
    public VisiteurDTO create(VisiteurDTO dto) {
        if (repository.existsByCin(dto.getCin())) {
            throw new IllegalArgumentException("Un visiteur avec ce CIN existe déjà");
        }
        Visiteur entity = toEntity(dto);
        entity.setIdVisiteur(null);
        return toDTO(repository.save(entity));
    }

    @Transactional
    public VisiteurDTO update(Integer id, VisiteurDTO dto) {
        Visiteur entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visiteur introuvable : id=" + id));
        
        if (!entity.getCin().equals(dto.getCin()) && repository.existsByCin(dto.getCin())) {
            throw new IllegalArgumentException("Un visiteur avec ce CIN existe déjà");
        }
        
        entity.setCin(dto.getCin());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        return toDTO(repository.save(entity));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Visiteur introuvable : id=" + id);
        }
        repository.deleteById(id);
    }

    private VisiteurDTO toDTO(Visiteur entity) {
        VisiteurDTO dto = new VisiteurDTO();
        dto.setIdVisiteur(entity.getIdVisiteur());
        dto.setCin(entity.getCin());
        dto.setNom(entity.getNom());
        dto.setPrenom(entity.getPrenom());
        dto.setCoordX(entity.getCoordX());
        dto.setCoordY(entity.getCoordY());
        dto.setDelegation(entity.getDelegation());
        dto.setGouvernorat(entity.getGouvernorat());
        return dto;
    }

    private Visiteur toEntity(VisiteurDTO dto) {
        Visiteur entity = new Visiteur();
        entity.setIdVisiteur(dto.getIdVisiteur());
        entity.setCin(dto.getCin());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setCoordX(dto.getCoordX());
        entity.setCoordY(dto.getCoordY());
        entity.setDelegation(dto.getDelegation());
        entity.setGouvernorat(dto.getGouvernorat());
        return entity;
    }
}
