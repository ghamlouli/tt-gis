package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "switch_outdoor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwitchOutdoor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_switch")
    private Integer idSwitch;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_delegation", nullable = false)
    @lombok.ToString.Exclude
    private Delegation delegation;

    @Column(name = "coord_x", precision = 10, scale = 6)
    private BigDecimal coordX;

    @Column(name = "coord_y", precision = 10, scale = 6)
    private BigDecimal coordY;

    @Column(name = "ports_attribues", nullable = false)
    private Integer portsAttribues = 0;

    @Column(name = "ports_occupes", nullable = false)
    private Integer portsOccupes = 0;

    @Column(name = "ports_libres", insertable = false, updatable = false)
    private Integer portsLibres;
}
