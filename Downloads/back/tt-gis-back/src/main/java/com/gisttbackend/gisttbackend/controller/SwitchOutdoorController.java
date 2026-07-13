package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.SwitchOutdoorRequest;
import com.gisttbackend.gisttbackend.dto.SwitchOutdoorResponse;
import com.gisttbackend.gisttbackend.service.SwitchOutdoorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/switch-outdoor")
@RequiredArgsConstructor
public class SwitchOutdoorController {

    private final SwitchOutdoorService switchOutdoorService;

    @PostMapping
    public ResponseEntity<SwitchOutdoorResponse> create(@Valid @RequestBody SwitchOutdoorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(switchOutdoorService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<SwitchOutdoorResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation) {
        return ResponseEntity.ok(switchOutdoorService.findAll(idGouv, idDelegation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        switchOutdoorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
