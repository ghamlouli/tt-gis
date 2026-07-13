package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.MsanRequest;
import com.gisttbackend.gisttbackend.dto.MsanResponse;
import com.gisttbackend.gisttbackend.service.MsanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/msan")
@RequiredArgsConstructor
public class MsanController {

    private final MsanService msanService;

    @PostMapping
    public ResponseEntity<MsanResponse> create(@Valid @RequestBody MsanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(msanService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<MsanResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation) {
        return ResponseEntity.ok(msanService.findAll(idGouv, idDelegation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        msanService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
