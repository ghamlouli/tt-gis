package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.StationGsmRequest;
import com.gisttbackend.gisttbackend.dto.StationGsmResponse;
import com.gisttbackend.gisttbackend.service.StationGSMService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations-gsm")
@RequiredArgsConstructor
public class StationGSMController {

    private final StationGSMService stationGSMService;

    @PostMapping
    public ResponseEntity<StationGsmResponse> create(@Valid @RequestBody StationGsmRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stationGSMService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<StationGsmResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation,
            @RequestParam(required = false) String fournisseur) {
        return ResponseEntity.ok(stationGSMService.findAll(idGouv, idDelegation, fournisseur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StationGsmResponse> update(@PathVariable Integer id, @Valid @RequestBody StationGsmRequest request) {
        return ResponseEntity.ok(stationGSMService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        stationGSMService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
