package com.pixelbloom.hospitalManagement.controller;

import com.pixelbloom.hospitalManagement.dto.AppointmentResponseDto;
import com.pixelbloom.hospitalManagement.dto.CreateAppointmentRequestDto;
import com.pixelbloom.hospitalManagement.dto.PatientRequestDto;
import com.pixelbloom.hospitalManagement.dto.PatientResponseDto;
import com.pixelbloom.hospitalManagement.service.AppointmentService;
import com.pixelbloom.hospitalManagement.service.PatientService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponseDto> createNewAppointment(@Valid @RequestBody CreateAppointmentRequestDto createAppointmentRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDto));
    }

    @GetMapping("/get/profile/{patientId}")
    public ResponseEntity<PatientResponseDto> getPatientProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }
//no need of patient postmapping becoz patient gets created by default when we signup

    @PutMapping("/update/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR','RECEPTIONIST')")
    public ResponseEntity<PatientResponseDto> updatePatient(@PathVariable Long patientId,
                                                            @Valid @RequestBody PatientRequestDto patientRequestDto) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, patientRequestDto));
    }

    @DeleteMapping("/delete/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long patientId) {
        patientService.deletePatient(patientId);
        return ResponseEntity.noContent().build();
    }


}
