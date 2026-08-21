package com.fms.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String skills;
    private String experience;
    private String bio;
    private String availability;
}
