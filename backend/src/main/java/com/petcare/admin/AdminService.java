package com.petcare.admin;

import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.dto.AdminDashboardStats;
import com.petcare.dto.UserResponse;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import com.petcare.user.Role; // Mantenha este import
import com.petcare.user.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AgendamentoRepository agendamentoRepository;

    @Autowired
    public AdminService(UserRepository userRepository, AgendamentoRepository agendamentoRepository) {
        this.userRepository = userRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAppointments = agendamentoRepository.count();
        long pendingApprovals = userRepository.countByRoleAndStatus(Role.SITTER, Status.PENDING);
        double monthlyRevenue = 0.0;
        return new AdminDashboardStats(totalUsers, monthlyRevenue, totalAppointments, pendingApprovals);
    }

    public List<UserResponse> findSitters(String status) {
        List<User> sitters;
        if (status != null && !status.isEmpty()) {
            Status statusEnum = Status.valueOf(status.toUpperCase());
            sitters = userRepository.findByRoleAndStatus(Role.SITTER, statusEnum);
        } else {
            sitters = userRepository.findByRole(Role.SITTER);
        }
        return sitters.stream().map(this::convertToUserResponse).collect(Collectors.toList());
    }

    public List<UserResponse> findAllOwners() {
        List<User> owners = userRepository.findByRole(Role.OWNER);
        return owners.stream().map(this::convertToUserResponse).collect(Collectors.toList());
    }

    @Transactional
    public void updateSitterStatus(Long sitterId, String newStatus) {
        User sitter = userRepository.findById(sitterId)
                .orElseThrow(() -> new RuntimeException("Sitter não encontrado com o ID: " + sitterId));

        // CORRIGIDO: Agora a comparação funciona
        if (sitter.getRole() != Role.SITTER) {
            throw new IllegalArgumentException("Usuário não é um Sitter.");
        }

        Status statusEnum = Status.valueOf(newStatus.toUpperCase());
        // CORRIGIDO: Agora o método setStatus existe na entidade User
        sitter.setStatus(statusEnum);
        userRepository.save(sitter);
    }

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                // CORRIGIDO: Agora o método getStatus existe na entidade User
                user.getStatus().name()
        );
    }
}