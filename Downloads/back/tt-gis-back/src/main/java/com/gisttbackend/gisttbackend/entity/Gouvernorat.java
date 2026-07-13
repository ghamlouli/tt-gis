package com.gisttbackend.gisttbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "gouvernorat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Gouvernorat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gouv")
    private Integer idGouv;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;
}