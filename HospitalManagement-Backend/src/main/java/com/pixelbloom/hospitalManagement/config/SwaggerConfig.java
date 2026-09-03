package com.pixelbloom.hospitalManagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.servlet.context-path:/}")
    private String contextPath;

    @Bean
    public OpenAPI hospitalManagementOpenAPI() {
        // Server configuration
        Server server = new Server()
                .url("http://localhost:8080" + contextPath)
                .description("Development Server");

        // Contact information
        Contact contact = new Contact()
                .name("Hospital Management Team")
                .email("support@hospital.com")
                .url("https://hospital.com");

        // License information
        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        // API Info
        Info info = new Info()
                .title("Hospital Management System API")
                .version("1.0.0")
                .description("""
                        ## Hospital Management System REST API Documentation
                        
                        This API provides endpoints for managing hospital operations including:
                        - **Patient Management** - Register, update, and manage patient profiles
                        - **Doctor Management** - Onboard doctors, manage schedules and profiles  
                        - **Appointment System** - Book, reschedule, and manage appointments
                        - **Department Management** - Organize doctors by departments
                        - **Authentication** - JWT-based auth with OAuth2 social login
                        - **Admin Operations** - User role management and system administration
                        
                        ### Authentication
                        Most endpoints require JWT authentication. Use the `/auth/login` endpoint to get a JWT token,
                        then include it in the `Authorization` header as `Bearer <token>`.
                        
                        ### Error Responses
                        All errors follow a consistent format:
                        ```json
                        {
                          "message": "Error description",
                          "statusCode": 400
                        }
                        ```
                        
                        ### Base URL
                        All endpoints are prefixed with `/api/v1`
                        """)
                .contact(contact)
                .license(license);

        // Security scheme for JWT Bearer token
        SecurityScheme jwtSecurityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Enter JWT Bearer token for authentication");

        // Security requirement
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("JWT Bearer Token");

        return new OpenAPI()
                .info(info)
                .servers(List.of(server))
                .components(new Components()
                        .addSecuritySchemes("JWT Bearer Token", jwtSecurityScheme))
                .addSecurityItem(securityRequirement);
    }
}