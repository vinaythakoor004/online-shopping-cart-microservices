package com.onlineshoping.user_service.repository;

import com.onlineshoping.user_service.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}