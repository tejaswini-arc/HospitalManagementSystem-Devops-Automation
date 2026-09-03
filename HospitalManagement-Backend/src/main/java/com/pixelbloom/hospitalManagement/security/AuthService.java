package com.pixelbloom.hospitalManagement.security;

import com.pixelbloom.hospitalManagement.dto.LoginRequestDto;
import com.pixelbloom.hospitalManagement.dto.LoginResponseDto;
import com.pixelbloom.hospitalManagement.dto.SignUpRequestDto;
import com.pixelbloom.hospitalManagement.dto.SignupResponseDto;
import com.pixelbloom.hospitalManagement.entity.Patient;
import com.pixelbloom.hospitalManagement.entity.User;
import com.pixelbloom.hospitalManagement.entity.type.AuthProviderType;
import com.pixelbloom.hospitalManagement.entity.type.RoleType;
import com.pixelbloom.hospitalManagement.repository.PatientRepository;
import com.pixelbloom.hospitalManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDto(token, user.getId());
    }

    public User signUpInternal(SignUpRequestDto signupRequestDto, AuthProviderType authProviderType, String providerId) {
        User user = userRepository.findByUsername(signupRequestDto.getUsername()).orElse(null);

        if(user != null) throw new IllegalArgumentException("User already exists");

        user = User.builder()
                .username(signupRequestDto.getUsername())
                .providerId(providerId)
                .providerType(authProviderType)
                .roles(signupRequestDto.getRoles()) // Role.PATIENT
                .build();

        if(authProviderType == AuthProviderType.EMAIL) {
            user.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        }

        user = userRepository.save(user);

        Patient patient = Patient.builder()
                .name(signupRequestDto.getName())
                .email(signupRequestDto.getUsername())
                .user(user)
                .build();
        patientRepository.save(patient);

       return user;
    }

    // login controller
    public SignupResponseDto signup(SignUpRequestDto signupRequestDto) {
        signupRequestDto.setRoles(Set.of(RoleType.PATIENT));
        User user = signUpInternal(signupRequestDto, AuthProviderType.EMAIL, null);
        return new SignupResponseDto(user.getId(), user.getUsername());
    }


}


















