package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.GisCloudResponse;
import com.gisttbackend.gisttbackend.entity.MetroEthernet;
import com.gisttbackend.gisttbackend.entity.Msan;
import com.gisttbackend.gisttbackend.entity.StationGSM;
import com.gisttbackend.gisttbackend.entity.SwitchOutdoor;
import com.gisttbackend.gisttbackend.repository.MetroEthernetRepository;
import com.gisttbackend.gisttbackend.repository.MsanRepository;
import com.gisttbackend.gisttbackend.repository.StationGSMRepository;
import com.gisttbackend.gisttbackend.repository.SwitchOutdoorRepository;
import com.gisttbackend.gisttbackend.specification.GeoFilterSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GisCloudService {

    public static final String ACCES_METROETHERNET = "MetroEthernet";
    public static final String ACCES_GSM = "GSM";
    public static final String ACCES_FO = "FO";
    public static final String ACCES_MSAN = "MSAN";

    private final MetroEthernetRepository metroEthernetRepository;
    private final StationGSMRepository stationGSMRepository;
    private final MsanRepository msanRepository;
    private final SwitchOutdoorRepository switchOutdoorRepository;

    @Transactional(readOnly = true)
    public List<GisCloudResponse> findAll(Integer idGouv, Integer idDelegation, String acces) {
        List<GisCloudResponse> rows = new ArrayList<>();

        if (acces == null || acces.equalsIgnoreCase(ACCES_METROETHERNET)) {
            var spec = GeoFilterSpecifications.<MetroEthernet>geo(idGouv, idDelegation);
            rows.addAll(mapMetroEthernet(metroEthernetRepository.findAll(spec)));
        }
        if (acces == null || acces.equalsIgnoreCase(ACCES_GSM)) {
            var spec = GeoFilterSpecifications.<StationGSM>geo(idGouv, idDelegation);
            rows.addAll(mapGsm(stationGSMRepository.findAll(spec)));
        }
        if (acces == null || acces.equalsIgnoreCase(ACCES_FO)) {
            var spec = GeoFilterSpecifications.<SwitchOutdoor>geo(idGouv, idDelegation);
            rows.addAll(mapSwitchOutdoor(switchOutdoorRepository.findAll(spec)));
        }
        if (acces == null || acces.equalsIgnoreCase(ACCES_MSAN)) {
            var spec = GeoFilterSpecifications.<Msan>geo(idGouv, idDelegation);
            rows.addAll(mapMsan(msanRepository.findAll(spec)));
        }

        return rows;
    }

    private List<GisCloudResponse> mapMetroEthernet(List<MetroEthernet> list) {
        return list.stream().map(e -> new GisCloudResponse(
                ACCES_METROETHERNET,
                e.getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getDelegation().getNom(),
                e.getPortsLibres(),
                Collections.emptyList()
        )).toList();
    }

    private List<GisCloudResponse> mapGsm(List<StationGSM> list) {
        return list.stream().map(e -> new GisCloudResponse(
                ACCES_GSM,
                e.getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getDelegation().getNom(),
                null,
                e.getTechnologies()
        )).toList();
    }

    private List<GisCloudResponse> mapMsan(List<Msan> list) {
        return list.stream().map(e -> new GisCloudResponse(
                ACCES_MSAN,
                e.getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getDelegation().getNom(),
                e.getCapaciteLibre(),
                Collections.emptyList()
        )).toList();
    }

    private List<GisCloudResponse> mapSwitchOutdoor(List<SwitchOutdoor> list) {
        return list.stream().map(e -> new GisCloudResponse(
                ACCES_FO,
                e.getNom(),
                e.getCoordX(),
                e.getCoordY(),
                e.getDelegation().getGouvernorat().getNom(),
                e.getDelegation().getNom(),
                e.getPortsLibres(),
                Collections.emptyList()
        )).toList();
    }
}