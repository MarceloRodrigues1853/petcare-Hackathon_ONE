package com.petcare.dto;

public class LoginResponse {
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    // getter
    public String getToken() {
                return token;
        }

    // setter
    public void setToken(String token) {
                this.token = token;
        }
}
