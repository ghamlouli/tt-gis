package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.GouvernoratDTO;
import com.gisttbackend.gisttbackend.service.GouvernoratService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gouvernorats")
@RequiredArgsConstructor
public class GouvernoratController {

    private final GouvernoratService service;

    @GetMapping
    public ResponseEntity<List<GouvernoratDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GouvernoratDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<GouvernoratDTO> create(@Valid @RequestBody GouvernoratDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GouvernoratDTO> update(@PathVariable Integer id, @Valid @RequestBody GouvernoratDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}