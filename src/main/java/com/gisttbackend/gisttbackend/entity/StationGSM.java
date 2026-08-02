package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "station_gsm")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationGSM {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_station")
    private Integer idStation;

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

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "technologies", nullable = false)
    private List<String> technologies;

    @Column(name = "fournisseur", nullable = false, length = 20)
    private String fournisseur;
}
