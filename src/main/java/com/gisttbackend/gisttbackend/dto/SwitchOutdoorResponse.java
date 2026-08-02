package com.gisttbackend.gisttbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwitchOutdoorResponse {
    private Integer idSwitch;
    private String code;
    private String nom;
    private Integer idDelegation;
    private String delegation;
    private String gouvernorat;
    private BigDecimal coordX;
    private BigDecimal coordY;
    private Integer portsAttribues;
    private Integer portsOccupes;
    private Integer portsLibres;
}
