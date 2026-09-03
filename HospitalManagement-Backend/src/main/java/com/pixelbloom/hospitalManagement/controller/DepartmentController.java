package com.pixelbloom.hospitalManagement.controller;

import com.pixelbloom.hospitalManagement.dto.DepartmentRequestDto;
import com.pixelbloom.hospitalManagement.dto.DepartmentResponseDto;
import com.pixelbloom.hospitalManagement.service.DepartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Create a new department.
     *
     * POST /admin/departments
     */
    @PostMapping
    public ResponseEntity<DepartmentResponseDto> createDepartment(
            @Valid @RequestBody DepartmentRequestDto dto) {

        DepartmentResponseDto response =
                departmentService.createDepartment(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Backward-compatible endpoint.
     *
     * POST /admin/departments/Add
     *
     * This can be removed after the frontend is fully migrated
     * to POST /admin/departments.
     */
    @PostMapping("/Add")
    public ResponseEntity<DepartmentResponseDto> createDepartmentLegacy(
            @Valid @RequestBody DepartmentRequestDto dto) {

        DepartmentResponseDto response =
                departmentService.createDepartment(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DepartmentResponseDto>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }

    @PatchMapping("/{departmentId}/assign-doctors")
    public ResponseEntity<DepartmentResponseDto> assignDoctors(
            @PathVariable Long departmentId,
            @RequestBody Set<Long> doctorIds) {

        return ResponseEntity.ok(
                departmentService.assignDoctors(
                        departmentId,
                        doctorIds
                )
        );
    }
}