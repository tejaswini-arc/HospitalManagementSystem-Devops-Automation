package com.pixelbloom.hospitalManagement.service;

import com.pixelbloom.hospitalManagement.dto.PatientRequestDto;
import com.pixelbloom.hospitalManagement.dto.PatientResponseDto;
import com.pixelbloom.hospitalManagement.entity.Patient;
import com.pixelbloom.hospitalManagement.entity.User;
import com.pixelbloom.hospitalManagement.entity.type.AuthProviderType;
import com.pixelbloom.hospitalManagement.entity.type.RoleType;
import com.pixelbloom.hospitalManagement.repository.PatientRepository;
import com.pixelbloom.hospitalManagement.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final UserRepository userRepository;

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new EntityNotFoundException("Patient Not " +
                "Found with id: " + patientId));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    public List<PatientResponseDto> getAllPatients(Integer pageNumber, Integer pageSize) {
        return patientRepository.findAllPatients(PageRequest.of(pageNumber, pageSize))
                .stream()
                .map(patient -> modelMapper.map(patient, PatientResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientResponseDto createPatient(PatientRequestDto dto) {
        User user = User.builder()
                .username(dto.getEmail())
                .providerType(AuthProviderType.EMAIL)
                .roles(Set.of(RoleType.PATIENT))
                .build();
        user = userRepository.save(user);

        Patient patient = modelMapper.map(dto, Patient.class);
        patient.setUser(user);
        return modelMapper.map(patientRepository.save(patient), PatientResponseDto.class);
    }

    @Transactional
    public PatientResponseDto updatePatient(Long patientId, PatientRequestDto dto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with id: " + patientId));
        modelMapper.map(dto, patient);
        patient.getUser().setUsername(dto.getEmail());
        return modelMapper.map(patientRepository.save(patient), PatientResponseDto.class);
    }

    @Transactional
    public void deletePatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with id: " + patientId));
        Long userId = patient.getUser().getId(); // capture before deletion
        patientRepository.delete(patient);
        userRepository.deleteById(userId);
    }

}
