package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "msan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Msan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_msan")
    private Integer idMsan;

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

    @Column(name = "capacite_raccordee", nullable = false)
    private Integer capaciteRaccordee = 0;

    @Column(name = "capacite_occupee", nullable = false)
    private Integer capaciteOccupee = 0;

    @Column(name = "capacite_libre", insertable = false, updatable = false)
    private Integer capaciteLibre;
}
