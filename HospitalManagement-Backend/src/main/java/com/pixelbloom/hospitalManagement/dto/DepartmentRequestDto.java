package com.pixelbloom.hospitalManagement.dto;

import lombok.Data;
import java.util.Set;

@Data
public class DepartmentRequestDto {
    private String name;
    private Long headDoctorId;
    private Set<Long> doctorIds;
}
