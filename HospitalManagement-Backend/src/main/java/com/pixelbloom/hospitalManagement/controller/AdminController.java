package com.pixelbloom.hospitalManagement.controller;

import com.pixelbloom.hospitalManagement.dto.DoctorResponseDto;
import com.pixelbloom.hospitalManagement.dto.OnboardDoctorRequestDto;
import com.pixelbloom.hospitalManagement.dto.PatientResponseDto;
import com.pixelbloom.hospitalManagement.dto.UpdateUserRolesRequestDto;
import com.pixelbloom.hospitalManagement.service.DoctorService;
import com.pixelbloom.hospitalManagement.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponseDto>> getAllPatients(
            @RequestParam(value = "page", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "size", defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok(patientService.getAllPatients(pageNumber, pageSize));
    }

    @PostMapping("/onBoardNewDoctor")
    public ResponseEntity<DoctorResponseDto> onBoardNewDoctor(@Valid @RequestBody OnboardDoctorRequestDto onboardDoctorRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.onBoardNewDoctor(onboardDoctorRequestDto));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PutMapping("/users/roles")
    public ResponseEntity<Void> updateUserRoles(@RequestBody UpdateUserRolesRequestDto updateUserRolesRequestDto) {
        doctorService.updateUserRoles(updateUserRolesRequestDto);
        return ResponseEntity.noContent().build();
    }



}
