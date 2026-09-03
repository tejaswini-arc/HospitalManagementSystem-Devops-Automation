package com.pixelbloom.hospitalManagement.error;

import io.jsonwebtoken.JwtException;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message =
                ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(error ->
                                error.getField()
                                        + ": "
                                        + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));

        ApiError apiError =
                new ApiError(
                        message,
                        HttpStatus.BAD_REQUEST
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(apiError);
    }

    /**
     * Handles invalid JSON and enum conversion errors.
     *
     * Example:
     * bloodGroup = "Apositive"
     *
     * instead of:
     * bloodGroup = "A_POSITIVE"
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleJsonParseException(
            HttpMessageNotReadableException ex) {

        String message =
                "Invalid request data.";

        Throwable cause = ex.getMostSpecificCause();

        if (cause != null
                && cause.getMessage() != null) {

            String causeMessage =
                    cause.getMessage();

            if (causeMessage.contains(
                    "BloodGroupType")) {

                message =
                        "Invalid blood group. "
                                + "Allowed values: "
                                + "A_POSITIVE, A_NEGATIVE, "
                                + "B_POSITIVE, B_NEGATIVE, "
                                + "AB_POSITIVE, AB_NEGATIVE, "
                                + "O_POSITIVE, O_NEGATIVE.";
            } else {
                message =
                        "Invalid JSON request: "
                                + causeMessage;
            }
        }

        System.err.println(
                "JSON parsing error: "
                        + ex.getMessage()
        );

        ex.printStackTrace();

        ApiError apiError =
                new ApiError(
                        message,
                        HttpStatus.BAD_REQUEST
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(apiError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException ex) {

        System.err.println(
                "DATABASE CONSTRAINT ERROR"
        );

        ex.printStackTrace();

        String message =
                "Database constraint violation.";

        Throwable root = ex;

        while (root.getCause() != null) {
            root = root.getCause();
        }

        if (root.getMessage() != null) {

            String databaseMessage =
                    root.getMessage();

            System.err.println(
                    "Root database error: "
                            + databaseMessage
            );

            if (databaseMessage
                    .toLowerCase()
                    .contains("duplicate")) {

                message =
                        "A record with the same "
                                + "unique value already exists.";
            }
        }

        ApiError apiError =
                new ApiError(
                        message,
                        HttpStatus.CONFLICT
                );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(apiError);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError>
    handleUsernameNotFoundException(
            UsernameNotFoundException ex) {

        ApiError apiError =
                new ApiError(
                        "Username not found with username: "
                                + ex.getMessage(),
                        HttpStatus.NOT_FOUND
                );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(apiError);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError>
    handleEntityNotFoundException(
            EntityNotFoundException ex) {

        ApiError apiError =
                new ApiError(
                        ex.getMessage(),
                        HttpStatus.NOT_FOUND
                );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(apiError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError>
    handleIllegalArgumentException(
            IllegalArgumentException ex) {

        System.err.println(
                "BAD REQUEST: "
                        + ex.getMessage()
        );

        ApiError apiError =
                new ApiError(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(apiError);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError>
    handleAuthenticationException(
            AuthenticationException ex) {

        ApiError apiError =
                new ApiError(
                        "Authentication failed: "
                                + ex.getMessage(),
                        HttpStatus.UNAUTHORIZED
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(apiError);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiError>
    handleJwtException(
            JwtException ex) {

        ApiError apiError =
                new ApiError(
                        "Invalid JWT token: "
                                + ex.getMessage(),
                        HttpStatus.UNAUTHORIZED
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(apiError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError>
    handleAccessDeniedException(
            AccessDeniedException ex) {

        ApiError apiError =
                new ApiError(
                        "Access denied: "
                                + "Insufficient permissions",
                        HttpStatus.FORBIDDEN
                );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(apiError);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError>
    handleUnsupportedMediaType(
            HttpMediaTypeNotSupportedException ex) {

        ApiError apiError =
                new ApiError(
                        "Content-Type must be "
                                + "application/json.",
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE
                );

        return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError>
    handleGenericException(Exception ex) {

        System.err.println(
                "UNHANDLED APPLICATION ERROR"
        );

        System.err.println(
                "Exception type: "
                        + ex.getClass().getName()
        );

        System.err.println(
                "Exception message: "
                        + ex.getMessage()
        );

        ex.printStackTrace();

        ApiError apiError =
                new ApiError(
                        "An unexpected server error occurred.",
                        HttpStatus.INTERNAL_SERVER_ERROR
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(apiError);
    }
}