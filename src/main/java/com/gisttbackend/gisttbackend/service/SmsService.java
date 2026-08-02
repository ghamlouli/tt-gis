package com.gisttbackend.gisttbackend.service;

import com.gisttbackend.gisttbackend.dto.GisCloudResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final GisCloudService gisCloudService;


    public String buildReplyMessage(BigDecimal x, BigDecimal y) {
        // Un seul appel, réutilise entièrement la logique déjà existante
        // et testée de GIS Cloud (aucune duplication de requêtes SQL).
        List<GisCloudResponse> allRows = gisCloudService.findAll(null, null, null);

        Optional<GisCloudResponse> nearest = findNearest(allRows, x, y);

        if (nearest.isEmpty()) {
            return "Aucun réseau d'accès référencé n'a été trouvé dans notre base actuellement.";
        }

        String delegation = nearest.get().getDelegation();

        Set<String> accesDisponibles = new LinkedHashSet<>();
        for (GisCloudResponse row : allRows) {
            if (delegation.equalsIgnoreCase(row.getDelegation())) {
                accesDisponibles.add(row.getAcces());
            }
        }

        return "Les réseaux d'accès les plus proches de vous dans " + delegation + " sont : "
                + String.join(", ", accesDisponibles) + ".";
    }

    private Optional<GisCloudResponse> findNearest(List<GisCloudResponse> rows, BigDecimal x, BigDecimal y) {
        double targetLat = y.doubleValue();
        double targetLon = x.doubleValue();

        GisCloudResponse best = null;
        double bestDistanceKm = Double.MAX_VALUE;

        for (GisCloudResponse row : rows) {
            if (row.getCoordX() == null || row.getCoordY() == null) {
                continue;
            }

            double distance = haversineKm(targetLat, targetLon, row.getCoordY().doubleValue(), row.getCoordX().doubleValue());

            if (distance < bestDistanceKm) {
                bestDistanceKm = distance;
                best = row;
            }
        }

        return Optional.ofNullable(best);
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double earthRadiusKm = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }
}
