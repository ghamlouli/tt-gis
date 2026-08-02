package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "visiteur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Visiteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visiteur")
    private Integer idVisiteur;

    @Column(name = "cin", nullable = false, unique = true, length = 20)
    private String cin;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;

    @Column(name = "coordx")
    private Double coordX;

    @Column(name = "coordy")
    private Double coordY;

    @Column(name = "delegation", length = 100)
    private String delegation;

    @Column(name = "gouvernorat", length = 100)
    private String gouvernorat;
}
