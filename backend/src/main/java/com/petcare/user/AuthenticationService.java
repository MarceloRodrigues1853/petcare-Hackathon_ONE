package com.petcare.user;

import com.petcare.dto.RegisterRequest;

public interface AuthenticationService {
    User register(RegisterRequest req);
    void authenticate(String email, String rawPassword);
    User loadByEmail(String email);
}
