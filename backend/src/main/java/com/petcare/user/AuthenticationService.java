package com.petcare.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository userRepository;

  public User register(User user) {
    // exemplo: garantir hash
    if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty()) {
      user.setPasswordHash(User.hash(user.getPasswordHash()));
    }
    if (user.getRole() == null) {
      user.setRole(Role.USER);
    }
    return userRepository.save(user);
  }

  // outros métodos de autenticação/login…
}
