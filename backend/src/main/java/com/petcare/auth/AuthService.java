package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest req);
    LoginResponse login(String email, String password);
}
