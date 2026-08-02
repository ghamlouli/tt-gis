package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.GouvernoratDTO;
import com.gisttbackend.gisttbackend.entity.Gouvernorat;
import com.gisttbackend.gisttbackend.repository.GouvernoratRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GouvernoratService {

    private final GouvernoratRepository repository;

    public List<GouvernoratDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public GouvernoratDTO findById(Integer id) {
        Gouvernorat entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gouvernorat introuvable : id=" + id));
        return toDTO(entity);
    }

    @Transactional
    public GouvernoratDTO create(GouvernoratDTO dto) {
        Gouvernorat entity = toEntity(dto);
        entity.setIdGouv(null);
        return toDTO(repository.save(entity));
    }

    @Transactional
    public GouvernoratDTO update(Integer id, GouvernoratDTO dto) {
        Gouvernorat entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gouvernorat introuvable : id=" + id));
        entity.setNom(dto.getNom());
        entity.setCode(dto.getCode());
        return toDTO(repository.save(entity));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Gouvernorat introuvable : id=" + id);
        }
        repository.deleteById(id);
    }

    private GouvernoratDTO toDTO(Gouvernorat entity) {
        GouvernoratDTO dto = new GouvernoratDTO();
        dto.setIdGouv(entity.getIdGouv());
        dto.setNom(entity.getNom());
        dto.setCode(entity.getCode());
        return dto;
    }

    private Gouvernorat toEntity(GouvernoratDTO dto) {
        Gouvernorat entity = new Gouvernorat();
        entity.setIdGouv(dto.getIdGouv());
        entity.setNom(dto.getNom());
        entity.setCode(dto.getCode());
        return entity;
    }
}