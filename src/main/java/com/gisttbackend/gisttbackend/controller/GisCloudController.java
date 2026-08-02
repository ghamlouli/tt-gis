package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.dto.GisCloudResponse;
import com.gisttbackend.gisttbackend.service.GisCloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gis-cloud")
@RequiredArgsConstructor
public class GisCloudController {

    private final GisCloudService gisCloudService;

    @GetMapping
    public ResponseEntity<List<GisCloudResponse>> findAll(
            @RequestParam(required = false) Integer idGouv,
            @RequestParam(required = false) Integer idDelegation,
            @RequestParam(required = false) String acces) {
        return ResponseEntity.ok(gisCloudService.findAll(idGouv, idDelegation, acces));
    }
}
