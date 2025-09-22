// src/main/java/com/petcare/owner/OwnerProfileController.java
package com.petcare.owner;

import com.petcare.owner.dto.OwnerProfileRequest;
import com.petcare.owner.dto.OwnerProfileResponse;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import com.petcare.config.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners/me")
@RequiredArgsConstructor
public class OwnerProfileController {

    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        if (email == null) {
            throw new ResourceNotFoundException("Usuário autenticado não encontrado.");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));
    }

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public OwnerProfileResponse getProfile() {
        User u = currentUser();
        return OwnerProfileResponse.from(u);
    }

    @PutMapping("/profile")
    @Transactional
    public OwnerProfileResponse updateProfile(@RequestBody OwnerProfileRequest req) {
        User u = currentUser();
        if (req.name() != null && !req.name().isBlank()) u.setName(req.name());
        if (req.phone() != null) u.setPhone(req.phone());
        if (req.bio() != null) u.setBio(req.bio());
        userRepository.save(u);
        return OwnerProfileResponse.from(u);
    }
}
