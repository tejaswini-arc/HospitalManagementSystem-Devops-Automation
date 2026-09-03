package com.pixelbloom.hospitalManagement.security;

import com.pixelbloom.hospitalManagement.dto.LoginResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pixelbloom.hospitalManagement.service.OAuth2AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final OAuth2AuthService oAuth2AuthService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        LoginResponseDto loginResponse = oAuth2AuthService.handleGoogleLogin(oAuth2User);

        response.sendRedirect("/api/v1/dashboard.html?token=" + loginResponse.getJwt() + "&userId=" + loginResponse.getUserId());
    }
}
