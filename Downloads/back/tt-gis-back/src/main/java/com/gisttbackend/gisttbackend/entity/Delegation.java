package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "delegation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delegation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_delegation")
    private Integer idDelegation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_gouv", nullable = false)
    @lombok.ToString.Exclude
    private Gouvernorat gouvernorat;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;
}