package com.gisttbackend.gisttbackend.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SmsMessageParser {


    private static final Pattern PATTERN = Pattern.compile(
            "^\\s*RESEAUX\\s+(-?\\d+[.,]?\\d*)\\s+(-?\\d+[.,]?\\d*)\\s*$",
            Pattern.CASE_INSENSITIVE
    );

    public record Coordinates(BigDecimal x, BigDecimal y) {
    }

    public Optional<Coordinates> parse(String body) {
        if (body == null) {
            return Optional.empty();
        }

        Matcher matcher = PATTERN.matcher(body.trim());

        if (!matcher.matches()) {
            return Optional.empty();
        }

        try {
            BigDecimal x = new BigDecimal(matcher.group(1).replace(',', '.'));
            BigDecimal y = new BigDecimal(matcher.group(2).replace(',', '.'));
            return Optional.of(new Coordinates(x, y));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }
}
