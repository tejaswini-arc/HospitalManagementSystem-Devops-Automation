package com.pixelbloom.hospitalManagement.dto;

import com.pixelbloom.hospitalManagement.entity.type.RoleType;
import lombok.Data;
import java.util.Set;

@Data
public class UpdateUserRolesRequestDto {
    private Long userId;
    private Set<RoleType> roles;
}
