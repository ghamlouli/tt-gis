package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.LienFHRequest;
import com.gisttbackend.gisttbackend.dto.LienFHResponse;
import com.gisttbackend.gisttbackend.service.LienFHService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/liens-fh")
@RequiredArgsConstructor
public class LienFHController {

    private final LienFHService lienFHService;

    @PostMapping
    public ResponseEntity<LienFHResponse> create(@Valid @RequestBody LienFHRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lienFHService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<LienFHResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation) {
        return ResponseEntity.ok(lienFHService.findAll(idGouv, idDelegation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        lienFHService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
