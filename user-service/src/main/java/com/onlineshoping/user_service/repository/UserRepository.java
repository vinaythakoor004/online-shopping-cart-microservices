package com.onlineshoping.user_service.repository;

import com.onlineshoping.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

import java.util.Optional;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByKeycloakUserId(String keycloakUserId);
}