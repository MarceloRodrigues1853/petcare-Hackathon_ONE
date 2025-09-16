package com.petcare.dto;

// O tipo do ID geralmente é Long em Java
public record LoginResponse(Long id, String token, String role, String name, String email) {}
