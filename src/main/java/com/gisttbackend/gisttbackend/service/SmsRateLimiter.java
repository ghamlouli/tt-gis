package com.gisttbackend.gisttbackend.service;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
public class SmsRateLimiter {

    private static final Duration MIN_INTERVAL = Duration.ofSeconds(15);

    private final Map<String, Instant> lastRequestByPhone = new ConcurrentHashMap<>();

    public boolean isAllowed(String phoneNumber) {
        Instant now = Instant.now();
        Instant last = lastRequestByPhone.get(phoneNumber);

        if (last != null && Duration.between(last, now).compareTo(MIN_INTERVAL) < 0) {
            return false;
        }

        lastRequestByPhone.put(phoneNumber, now);
        return true;
    }
}
