package com.pixelbloom.hospitalManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.util.Set;

@Data
public class DepartmentRequestDto {

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name cannot exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private Long headDoctorId;

    private Set<Long> doctorIds;
}