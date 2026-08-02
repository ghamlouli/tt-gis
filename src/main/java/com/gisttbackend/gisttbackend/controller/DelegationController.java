package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.DelegationDTO;
import com.gisttbackend.gisttbackend.service.DelegationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delegations")
@RequiredArgsConstructor
public class DelegationController {

    private final DelegationService service;

    @GetMapping
    public ResponseEntity<List<DelegationDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DelegationDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/gouvernorat/{idGouv}")
    public ResponseEntity<List<DelegationDTO>> findByGouvernorat(@PathVariable Integer idGouv) {
        return ResponseEntity.ok(service.findByGouvernorat(idGouv));
    }

    @PostMapping
    public ResponseEntity<DelegationDTO> create(@Valid @RequestBody DelegationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DelegationDTO> update(@PathVariable Integer id, @Valid @RequestBody DelegationDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}