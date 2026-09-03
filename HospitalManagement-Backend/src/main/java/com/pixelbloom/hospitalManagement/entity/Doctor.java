package com.pixelbloom.hospitalManagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @MapsId
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String specialization;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    private Integer experience;
    private Double consultationFee;
    private Boolean isActive = true;

    private String address;
    private String degree;
    private String profilePic;
    private String about;
    private String registrationNumber;
    //private String licenseNumber;
    private String hospitalName;
    private String departmentName;
    private Long departmentId;
    //private String registrationStatus;
    //private String departmentName;
    //private String registrationYear;
   // private String registrationState;
   // private String registrationCouncil;
   //private String registrationValidity;
    //private String registrationCertificate;
   //private String registrationDocument;



    @ManyToMany(mappedBy = "doctors")
    private Set<Department> departments = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments = new ArrayList<>();

}
