package com.pixelbloom.hospitalManagement.service;

import com.pixelbloom.hospitalManagement.dto.DoctorResponseDto;
import com.pixelbloom.hospitalManagement.dto.OnboardDoctorRequestDto;
import com.pixelbloom.hospitalManagement.dto.UpdateUserRolesRequestDto;
import com.pixelbloom.hospitalManagement.entity.Doctor;
import com.pixelbloom.hospitalManagement.entity.Patient;
import com.pixelbloom.hospitalManagement.entity.User;
import com.pixelbloom.hospitalManagement.entity.type.RoleType;
import com.pixelbloom.hospitalManagement.repository.AppointmentRepository;
import com.pixelbloom.hospitalManagement.repository.DoctorRepository;
import com.pixelbloom.hospitalManagement.repository.PatientRepository;
import com.pixelbloom.hospitalManagement.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final  AppointmentRepository appointmentRepository;

    public List<DoctorResponseDto> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doctor -> modelMapper.map(doctor, DoctorResponseDto.class))
                .collect(Collectors.toList());
    }


    @Transactional
    public DoctorResponseDto onBoardNewDoctor(OnboardDoctorRequestDto onBoardDoctorRequestDto) {
        User user = userRepository.findById(onBoardDoctorRequestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + onBoardDoctorRequestDto.getUserId()));

        if(doctorRepository.existsById(onBoardDoctorRequestDto.getUserId())) {
            throw new IllegalArgumentException("Already a doctor");
        }

        Doctor doctor = Doctor.builder()
                .name(onBoardDoctorRequestDto.getName())
                .specialization(onBoardDoctorRequestDto.getSpecialization())
                .user(user)
                .email(onBoardDoctorRequestDto.getEmail())
                .experience(onBoardDoctorRequestDto.getExperience())
                .consultationFee(onBoardDoctorRequestDto.getConsultationFee())
                .departmentId(onBoardDoctorRequestDto.getDepartmentId())
                .departmentName(onBoardDoctorRequestDto.getDepartmentName())
                .isActive(true)
                .registrationNumber(onBoardDoctorRequestDto.getRegistrationNumber())
                .phone(onBoardDoctorRequestDto.getPhone())
                .address(onBoardDoctorRequestDto.getAddress())
                .degree(onBoardDoctorRequestDto.getDegree())
                .profilePic(onBoardDoctorRequestDto.getProfilePic())
                .about(onBoardDoctorRequestDto.getAbout())
                .hospitalName(onBoardDoctorRequestDto.getHospitalName())
                .build();

        user.getRoles().add(RoleType.DOCTOR);
        userRepository.save(user); // fix: persist the role change

        return modelMapper.map(doctorRepository.save(doctor), DoctorResponseDto.class);
    }


    @Transactional
    public UpdateUserRolesRequestDto updateUserRoles(
            UpdateUserRolesRequestDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "User not found with id: " + dto.getUserId()
                        ));

        boolean changingToDoctor =
                dto.getRoles() != null &&
                        dto.getRoles().contains(RoleType.DOCTOR);

        if (changingToDoctor) {

            Patient patient = patientRepository
                    .findById(user.getId())
                    .orElse(null);

            if (patient != null) {


                boolean hasAppointments =
                        appointmentRepository.existsByPatientId(
                                patient.getId()
                        );

                if (hasAppointments) {
                    throw new IllegalStateException(
                            "Patient cannot be converted to doctor because " +
                                    "existing appointments are associated with this patient."
                    );
                }

                if (!doctorRepository.existsById(user.getId())) {

                    Doctor doctor = Doctor.builder()
                            .user(user)
                            .name(patient.getName())
                            .email(patient.getEmail())
                            .isActive(true)
                            .build();

                    doctorRepository.save(doctor);
                }

                // Delete ONLY patient profile.
                // Do NOT delete User.
                patientRepository.delete(patient);
            }
        }

        // Keep the same User record and update its role.
        user.setRoles(dto.getRoles());
        userRepository.save(user);

        dto.setRoles(user.getRoles());

        return dto;
    }

}
