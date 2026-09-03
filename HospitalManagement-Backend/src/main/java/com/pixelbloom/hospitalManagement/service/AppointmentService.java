package com.pixelbloom.hospitalManagement.service;

import com.pixelbloom.hospitalManagement.dto.AppointmentResponseDto;
import com.pixelbloom.hospitalManagement.dto.CreateAppointmentRequestDto;
import com.pixelbloom.hospitalManagement.entity.Appointment;
import com.pixelbloom.hospitalManagement.entity.Doctor;
import com.pixelbloom.hospitalManagement.entity.Patient;
import com.pixelbloom.hospitalManagement.entity.User;
import com.pixelbloom.hospitalManagement.repository.AppointmentRepository;
import com.pixelbloom.hospitalManagement.repository.DoctorRepository;
import com.pixelbloom.hospitalManagement.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_RECEPTIONIST')")
    public AppointmentResponseDto createNewAppointment(CreateAppointmentRequestDto createAppointmentRequestDto) {
        Long doctorId = createAppointmentRequestDto.getDoctorId();
        Long patientId = createAppointmentRequestDto.getPatientId();

        // patients can only book for themselves; receptionists can book for any patient
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isPatient = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));
        if (isPatient && !currentUser.getId().equals(patientId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to book appointments for another patient");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));

        Appointment appointment = Appointment.builder()
                .reason(createAppointmentRequestDto.getReason())
                .appointmentTime(createAppointmentRequestDto.getAppointmentTime())
                .build();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        appointment = appointmentRepository.save(appointment); // fix: save first, then add to collection
        patient.getAppointments().add(appointment);

        return modelMapper.map(appointment, AppointmentResponseDto.class);
    }

    @Transactional
    @PreAuthorize("hasAuthority('appointment:write') or #doctorId == authentication.principal.id")
    public Appointment reAssignAppointmentToAnotherDoctor(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        Doctor newDoctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));

        // fix: remove from old doctor's collection before reassigning
        Doctor oldDoctor = appointment.getDoctor();
        if (oldDoctor != null) {
            oldDoctor.getAppointments().remove(appointment);
        }

        appointment.setDoctor(newDoctor);
        newDoctor.getAppointments().add(appointment);

        return appointment;
    }

    @PreAuthorize("hasRole('ADMIN') OR (hasRole('DOCTOR') AND #doctorId == authentication.principal.id)")
    public List<AppointmentResponseDto> getAllAppointmentsOfDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));

        return doctor.getAppointments()
                .stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentResponseDto.class))
                .collect(Collectors.toList());
    }
}
