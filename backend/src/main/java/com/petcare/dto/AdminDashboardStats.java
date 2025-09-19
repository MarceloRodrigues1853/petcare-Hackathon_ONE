package com.petcare.dto;

public record AdminDashboardStats(
    long totalUsers,
    double monthlyRevenue,
    long totalAppointments,
    long pendingApprovals
) {}