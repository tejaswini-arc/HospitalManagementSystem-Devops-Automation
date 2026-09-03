package com.pixelbloom.hospitalManagement.dto;

import lombok.Data;
import java.util.Set;

@Data
public class DepartmentResponseDto {
    private Long id;
    private String name;
    private DoctorResponseDto headDoctor;
    private Set<DoctorResponseDto> doctors;
}
