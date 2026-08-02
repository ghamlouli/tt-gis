package com.gisttbackend.gisttbackend.smsgateway;

import com.gisttbackend.gisttbackend.config.SmsGatewayProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GatewaySmsSenderClient {

    private final SmsGatewayProperties properties;
    private final RestClient restClient = RestClient.create();

    public void sendSms(String destinationPhoneNumber, String message) {
        String normalizedNumber = normalizeToE164(destinationPhoneNumber);

        String url = "http://"
                + properties.getDeviceHost()
                + ":"
                + properties.getDevicePort()
                + properties.getSendEndpoint();

        Map<String, Object> body = Map.of(
                "textMessage", Map.of("text", message),
                "phoneNumbers", List.of(normalizedNumber)
        );

        try {
            restClient.post()
                    .uri(url)
                    .headers(headers -> headers.setBasicAuth(properties.getUsername(), properties.getPassword()))
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            log.info("SMS envoyé via le gateway téléphone vers {}", normalizedNumber);
        } catch (Exception e) {
            log.error("Échec d'envoi via le gateway téléphone ({}) : {}", url, e.getMessage());
        }
    }


    private String normalizeToE164(String rawNumber) {
        String digitsOnly = rawNumber.replaceAll("[^0-9+]", "");

        if (digitsOnly.startsWith("+")) {
            return digitsOnly;
        }
        if (digitsOnly.startsWith("00")) {
            return "+" + digitsOnly.substring(2);
        }
        if (digitsOnly.length() == 8) {
            // Numéro tunisien local à 8 chiffres -> ajoute l'indicatif +216
            return "+216" + digitsOnly;
        }
        return "+" + digitsOnly;
    }
}
