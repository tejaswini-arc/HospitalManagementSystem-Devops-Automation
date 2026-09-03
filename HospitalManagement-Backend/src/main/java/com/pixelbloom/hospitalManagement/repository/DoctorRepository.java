package com.pixelbloom.hospitalManagement.repository;

import com.pixelbloom.hospitalManagement.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}