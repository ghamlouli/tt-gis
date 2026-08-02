package com.gisttbackend.gisttbackend.controller;

import com.gisttbackend.gisttbackend.service.SmsMessageParser;
import com.gisttbackend.gisttbackend.service.SmsRateLimiter;
import com.gisttbackend.gisttbackend.service.SmsService;
import com.gisttbackend.gisttbackend.smsgateway.GatewaySmsSenderClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/sms-gateway")
@RequiredArgsConstructor
public class GatewaySmsWebhookController {

    private final SmsMessageParser smsMessageParser;
    private final SmsService smsService;
    private final SmsRateLimiter smsRateLimiter;
    private final GatewaySmsSenderClient gatewaySmsSenderClient;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleIncomingSms(@RequestBody Map<String, Object> payload) {
        log.info("Webhook SMS reçu (payload brut) : {}", payload);

        String fromNumber = extractPhoneNumber(payload);
        String body = extractMessage(payload);

        if (fromNumber == null || body == null) {
            log.warn("Impossible d'extraire numéro/texte du payload — vérifier la structure JSON réelle ci-dessus.");
            return ResponseEntity.ok().build();
        }

        if (!smsRateLimiter.isAllowed(fromNumber)) {
            gatewaySmsSenderClient.sendSms(fromNumber, "Trop de demandes récentes. Merci de réessayer dans quelques instants.");
            return ResponseEntity.ok().build();
        }

        String reply = smsMessageParser.parse(body)
                .map(coords -> smsService.buildReplyMessage(coords.x(), coords.y()))
                .orElse("Format invalide. Envoyez : RESEAUX <X> <Y> (ex: RESEAUX 34.7398 10.7600).");

        gatewaySmsSenderClient.sendSms(fromNumber, reply);

        return ResponseEntity.ok().build();
    }

    @SuppressWarnings("unchecked")
    private String extractPhoneNumber(Map<String, Object> payload) {
        Object direct = firstNonNull(payload.get("phoneNumber"), payload.get("from"));
        if (direct != null) {
            return String.valueOf(direct);
        }

        Object payloadField = payload.get("payload");
        if (payloadField instanceof Map<?, ?> inner) {
            Object nested = firstNonNull(inner.get("phoneNumber"), inner.get("from"));
            return nested != null ? String.valueOf(nested) : null;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private String extractMessage(Map<String, Object> payload) {
        Object direct = firstNonNull(payload.get("message"), payload.get("text"));
        if (direct != null) {
            return String.valueOf(direct);
        }

        Object payloadField = payload.get("payload");
        if (payloadField instanceof Map<?, ?> inner) {
            Object nested = firstNonNull(inner.get("message"), inner.get("text"));
            return nested != null ? String.valueOf(nested) : null;
        }
        return null;
    }

    private Object firstNonNull(Object a, Object b) {
        return a != null ? a : b;
    }
}
