package com.pixelbloom.hospitalManagement.controller;

import com.pixelbloom.hospitalManagement.dto.LoginRequestDto;
import com.pixelbloom.hospitalManagement.dto.LoginResponseDto;
import com.pixelbloom.hospitalManagement.dto.SignUpRequestDto;
import com.pixelbloom.hospitalManagement.dto.SignupResponseDto;
import com.pixelbloom.hospitalManagement.security.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    private final AuthService authService;

    @Operation(
        summary = "User login", 
        description = "Authenticate user with username/email and password to get JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Login successful",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = LoginResponseDto.class),
                examples = @ExampleObject(value = """
                    {
                      "jwt": "eyJhbGciOiJIUzI1NiJ9...",
                      "userId": 1
                    }
                """)
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Invalid credentials",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(value = """
                    {
                      "message": "Authentication failed: Bad credentials",
                      "statusCode": 401
                    }
                """)
            )
        )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User login credentials",
            content = @Content(
                examples = @ExampleObject(value = """
                    {
                      "username": "john@example.com",
                      "password": "SecurePass@123"
                    }
                """)
            )
        )
        @RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @Operation(
        summary = "User registration", 
        description = "Register a new patient account. Creates both user and patient profile automatically."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Registration successful",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SignupResponseDto.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 1,
                      "username": "john@example.com"
                    }
                """)
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "User already exists or validation error",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(value = """
                    {
                      "message": "User already exists",
                      "statusCode": 400
                    }
                """)
            )
        )
    })
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User registration details",
            content = @Content(
                examples = @ExampleObject(value = """
                    {
                      "username": "john@example.com",
                      "password": "SecurePass@123",
                      "name": "John Doe"
                    }
                """)
            )
        )
        @RequestBody SignUpRequestDto signupRequestDto) {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }
}
