package com.petcare.dto;

public record LoginResponse(String token, String role, String name, String email) {}
