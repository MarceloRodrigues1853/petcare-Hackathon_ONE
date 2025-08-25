package com.petcare.user;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

//PODEMOS USAR O USERCONTROLLER PARA FAZER O CRUD DEPOIS
//MOVI OS ENDPOINT PARA O AUTHCONTROLLER



//@RestController @RequestMapping("/auth")
//public class UserController {
//  public record RegisterRequest(String name, String email, String password, String role) {}
//  public record RegisterResponse(Long id, String name, String email, String role) {}
//  record Error(String message) {}
//
//  private final UserRepository repo;
//
//  public UserController(UserRepository repo){
//    this.repo = repo;
//  }
//
//  @PostMapping("/register")
//  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
//    if (repo.findByEmail(req.email()).isPresent()) {
//      return ResponseEntity.badRequest().body(new Error("Email já cadastrado"));
//    }
//    User u = new User();
//    u.setName(req.name());
//    u.setEmail(req.email());
//
//    u.setPasswordHash(User.hash(req.password()));
//
//    try {
//      if (req.role()!=null) {
//        u.setRole(User.Role.valueOf(req.role().toUpperCase()));
//      }
//    } catch (Exception ignored) {}
//
//    repo.save(u);
//
//    return ResponseEntity.ok(
//            new RegisterResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name()));
//  }
//
//  @GetMapping("/health")
//  public String health(){
//    return "OK";
//  }
//
//  @PostMapping("/login")
//  public  ResponseEntity<?> login(@RequestBody LoginRequest request){
//    Optional<User> userOptional = repo.findByEmail(request.email());
//    if(userOptional.isEmpty()) {
//      return ResponseEntity.status(401).body(Map.of("error", "Email ou senha inválidos"));
//
//    }
//
//    User user = userOptional.get();
//    if (!new BCryptPasswordEncoder().matches(request.password(), user.getPasswordHash())){
//      return ResponseEntity.status(401).body(Map.of("error", "Email ou senha inválidos"));
//
//    }
//
//    String token = jwtService.generateToken(user);
//    return  ResponseEntity.ok(new LoginResponse(token));
//  }
//}
