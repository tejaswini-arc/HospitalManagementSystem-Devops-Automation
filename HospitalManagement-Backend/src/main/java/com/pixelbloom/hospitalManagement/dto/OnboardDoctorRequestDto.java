package com.pixelbloom.hospitalManagement.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OnboardDoctorRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @Email(message = "Invalid email format")
    private String email;

    @Min(value = 0, message = "Experience cannot be negative")
    private int experience;

    @DecimalMin(value = "0.0", inclusive = false, message = "Consultation fee must be greater than 0")
    private Double consultationFee;

    private String registrationNumber;
    private Long departmentId;
    private String departmentName;
    private String phone;
    private String address;
    private String degree;
    private String profilePic;
    private String about;
    private String hospitalName;
}
