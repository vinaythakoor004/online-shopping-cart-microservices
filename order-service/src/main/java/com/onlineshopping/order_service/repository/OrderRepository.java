package com.onlineshopping.order_service.repository;

import com.onlineshopping.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}