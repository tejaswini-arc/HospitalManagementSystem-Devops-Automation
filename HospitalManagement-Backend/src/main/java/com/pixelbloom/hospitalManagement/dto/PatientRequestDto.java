package com.pixelbloom.hospitalManagement.dto;

import com.pixelbloom.hospitalManagement.entity.type.BloodGroupType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRequestDto {

    @NotBlank(message = "Name is required")
    @Size(max = 40, message = "Name must not exceed 40 characters")
    private String name;

    private String gender;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private BloodGroupType bloodGroup;
}
