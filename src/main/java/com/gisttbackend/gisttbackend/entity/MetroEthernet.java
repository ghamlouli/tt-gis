package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "metro_ethernet")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetroEthernet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metro")
    private Integer idMetro;

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

    @Column(name = "ip_gestion", length = 45)
    private String ipGestion;

    @Column(name = "ports_raccordes", nullable = false)
    private Integer portsRaccordes = 0;

    @Column(name = "ports_occupes", nullable = false)
    private Integer portsOccupes = 0;

    @Column(name = "ports_libres", insertable = false, updatable = false)
    private Integer portsLibres;
}
