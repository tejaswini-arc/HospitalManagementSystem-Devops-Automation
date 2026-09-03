package com.pixelbloom.hospitalManagement.repository;

import com.pixelbloom.hospitalManagement.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
}