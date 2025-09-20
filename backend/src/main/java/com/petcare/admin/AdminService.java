package com.petcare.admin;

import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.dto.AdminDashboardStats;
import com.petcare.dto.UserResponse;
import com.petcare.user.Role;
import com.petcare.user.Status;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AgendamentoRepository agendamentoRepository;

    public AdminService(UserRepository userRepository, AgendamentoRepository agendamentoRepository) {
        this.userRepository = userRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAppointments = agendamentoRepository.count();
        long pendingApprovals = userRepository.countByRoleAndStatus(Role.SITTER, Status.PENDING);
        double monthlyRevenue = 0.0; // TODO: implementar cálculo real
        return new AdminDashboardStats(totalUsers, monthlyRevenue, totalAppointments, pendingApprovals);
    }

    public List<UserResponse> findSitters(String status) {
        List<User> sitters;
        if (status != null && !status.isBlank()) {
            Status statusEnum = Status.valueOf(status.toUpperCase());
            sitters = userRepository.findByRoleAndStatus(Role.SITTER, statusEnum);
        } else {
            sitters = userRepository.findByRole(Role.SITTER);
        }
        return sitters.stream().map(UserResponse::from).toList();
    }

    public List<UserResponse> findAllOwners() {
        return userRepository.findByRole(Role.OWNER)
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public void updateSitterStatus(Long sitterId, String newStatus) {
        User sitter = userRepository.findById(sitterId)
                .orElseThrow(() -> new RuntimeException("Sitter não encontrado com o ID: " + sitterId));
        if (sitter.getRole() != Role.SITTER) {
            throw new IllegalArgumentException("Usuário não é um Sitter.");
        }
        Status statusEnum = Status.valueOf(newStatus.toUpperCase());
        sitter.setStatus(statusEnum);
        userRepository.save(sitter);
    }
}
