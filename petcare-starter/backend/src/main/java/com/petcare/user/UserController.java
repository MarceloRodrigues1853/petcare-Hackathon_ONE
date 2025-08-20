package com.petcare.user;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/auth")
public class UserController {
  public record RegisterRequest(String name, String email, String password, String role) {}
  public record RegisterResponse(Long id, String name, String email, String role) {}
  record Error(String message) {}
  private final UserRepository repo;
  public UserController(UserRepository repo){ this.repo = repo; }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
    if (repo.findByEmail(req.email()).isPresent()) return ResponseEntity.badRequest().body(new Error("Email já cadastrado"));
    User u = new User();
    u.setName(req.name()); u.setEmail(req.email()); u.setPasswordHash(User.hash(req.password()));
    try { if (req.role()!=null) u.setRole(User.Role.valueOf(req.role().toUpperCase())); } catch (Exception ignored) {}
    repo.save(u);
    return ResponseEntity.ok(new RegisterResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name()));
  }

  @GetMapping("/health") public String health(){ return "OK"; }
}
