package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.VisiteurDTO;
import com.gisttbackend.gisttbackend.service.VisiteurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visiteurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisiteurController {

    private final VisiteurService service;

    @GetMapping
    public ResponseEntity<List<VisiteurDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisiteurDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<VisiteurDTO> create(@Valid @RequestBody VisiteurDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisiteurDTO> update(@PathVariable Integer id, @Valid @RequestBody VisiteurDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
