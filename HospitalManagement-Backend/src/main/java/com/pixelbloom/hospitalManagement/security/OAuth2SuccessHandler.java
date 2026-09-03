package com.pixelbloom.hospitalManagement.security;

import com.pixelbloom.hospitalManagement.dto.LoginResponseDto;
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
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final OAuth2AuthService oAuth2AuthService;

    private static final String FRONTEND_URL =
            "http://localhost:3000";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        try {

            OAuth2User oauthUser =
                    (OAuth2User) authentication.getPrincipal();

            LoginResponseDto loginResponse =
                    oAuth2AuthService.handleGoogleLogin(
                            oauthUser
                    );

            String redirectUrl =
                    FRONTEND_URL
                            + "/oauth2/callback"
                            + "?token="
                            + loginResponse.getJwt()
                            + "&userId="
                            + loginResponse.getUserId();

            System.out.println(
                    "Google OAuth successful. "
                            + "Redirecting to React application."
            );

            response.sendRedirect(
                    redirectUrl
            );

        } catch (Exception ex) {

            System.err.println(
                    "Google OAuth authentication failed"
            );

            ex.printStackTrace();

            response.sendRedirect(
                    FRONTEND_URL
                            + "/login?oauthError=true"
            );
        }
    }
}