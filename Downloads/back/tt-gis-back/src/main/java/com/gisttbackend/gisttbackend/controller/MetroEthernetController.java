package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.MetroEthernetRequest;
import com.gisttbackend.gisttbackend.dto.MetroEthernetResponse;
import com.gisttbackend.gisttbackend.service.MetroEthernetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metroethernets")
@RequiredArgsConstructor
public class MetroEthernetController {

    private final MetroEthernetService metroEthernetService;

    @PostMapping
    public ResponseEntity<MetroEthernetResponse> create(@Valid @RequestBody MetroEthernetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(metroEthernetService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<MetroEthernetResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation) {
        return ResponseEntity.ok(metroEthernetService.findAll(idGouv, idDelegation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        metroEthernetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
