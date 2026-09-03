package com.pixelbloom.hospitalManagement.repository;

import com.pixelbloom.hospitalManagement.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}