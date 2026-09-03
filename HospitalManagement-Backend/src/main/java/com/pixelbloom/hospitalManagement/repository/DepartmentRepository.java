package com.pixelbloom.hospitalManagement.repository;

import com.pixelbloom.hospitalManagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByNameIgnoreCase(String departmentName);

}