package com.pixelbloom.hospitalManagement.service;

import com.pixelbloom.hospitalManagement.dto.LoginResponseDto;
import com.pixelbloom.hospitalManagement.dto.SignUpRequestDto;
import com.pixelbloom.hospitalManagement.entity.User;
import com.pixelbloom.hospitalManagement.entity.type.AuthProviderType;
import com.pixelbloom.hospitalManagement.entity.type.RoleType;
import com.pixelbloom.hospitalManagement.repository.UserRepository;
import com.pixelbloom.hospitalManagement.security.AuthService;
import com.pixelbloom.hospitalManagement.security.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class OAuth2AuthService {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public LoginResponseDto handleGoogleLogin(OAuth2User oAuth2User) {
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByProviderIdAndProviderType(providerId, AuthProviderType.GOOGLE).orElse(null);
        User emailUser = email != null ? userRepository.findByUsername(email).orElse(null) : null;

        if (user == null && emailUser == null) {
            String username = (email != null && !email.isBlank()) ? email : providerId;
            user = authService.signUpInternal(
                    new SignUpRequestDto(username, null, name, Set.of(RoleType.PATIENT)),
                    AuthProviderType.GOOGLE,
                    providerId
            );
        } else if (user != null) {
            if (email != null && !email.isBlank() && !email.equals(user.getUsername())) {
                user.setUsername(email);
                userRepository.save(user);
            }
        } else {
            throw new BadCredentialsException(
                    "This email is already registered with provider " + emailUser.getProviderType()
            );
        }

        return new LoginResponseDto(authUtil.generateAccessToken(user), user.getId());
    }
}
