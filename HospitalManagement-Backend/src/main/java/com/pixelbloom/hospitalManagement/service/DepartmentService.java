package com.pixelbloom.hospitalManagement.service;

import com.pixelbloom.hospitalManagement.dto.DepartmentRequestDto;
import com.pixelbloom.hospitalManagement.dto.DepartmentResponseDto;
import com.pixelbloom.hospitalManagement.entity.Department;
import com.pixelbloom.hospitalManagement.entity.Doctor;
import com.pixelbloom.hospitalManagement.repository.DepartmentRepository;
import com.pixelbloom.hospitalManagement.repository.DoctorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public DepartmentResponseDto createDepartment(DepartmentRequestDto dto) {
        Department department = new Department();
        department.setName(dto.getName());

        if (dto.getHeadDoctorId() != null) {
            Doctor headDoctor = doctorRepository.findById(dto.getHeadDoctorId())
                    .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + dto.getHeadDoctorId()));
            department.setHeadDoctor(headDoctor);
        }

        if (dto.getDoctorIds() != null && !dto.getDoctorIds().isEmpty()) {
            Set<Doctor> doctors = new HashSet<>(doctorRepository.findAllById(dto.getDoctorIds()));
            department.setDoctors(doctors);
        }

        return modelMapper.map(departmentRepository.save(department), DepartmentResponseDto.class);
    }

    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(dept -> modelMapper.map(dept, DepartmentResponseDto.class))
                .collect(Collectors.toList());
    }
    @Transactional
    public DepartmentResponseDto assignDoctors(Long departmentId, Set<Long> doctorIds) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + departmentId));
        Set<Doctor> doctors = new HashSet<>(doctorRepository.findAllById(doctorIds));
        department.getDoctors().addAll(doctors);
        return modelMapper.map(departmentRepository.save(department), DepartmentResponseDto.class);
    }

}