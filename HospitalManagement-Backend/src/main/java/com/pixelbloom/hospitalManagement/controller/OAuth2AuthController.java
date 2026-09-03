package com.pixelbloom.hospitalManagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * OAuth2 flow is fully handled by OAuth2SuccessHandler.
 * After Google redirects back, Spring Security calls OAuth2SuccessHandler
 * which writes the JWT directly to the HTTP response.
 *
 * Flow:
 *   1. User clicks "Continue with Google" → GET /oauth2/authorization/google
 *   2. Google authenticates → redirects to /login/oauth2/code/google
 *   3. Spring Security processes callback → calls OAuth2SuccessHandler
 *   4. OAuth2SuccessHandler writes { jwt, userId } as JSON response
 */
@Controller
@RequestMapping("/oauth2")
public class OAuth2AuthController {

    @GetMapping("/login")
    public String loginPage() {
        return "redirect:/login.html";
    }
}
