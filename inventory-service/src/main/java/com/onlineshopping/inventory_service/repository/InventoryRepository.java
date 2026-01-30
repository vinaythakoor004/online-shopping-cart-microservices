package com.onlineshopping.inventory_service.repository;

import com.onlineshopping.inventory_service.model.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT i FROM Inventory i WHERE i.skuCode IN :skuCodes")
//    List<Inventory> findBySkuCodeIn(@Param("skuCodes") List<String> skuCode);
    List<Inventory> findBySkuCodeIn(List<String> skuCode);

    void deleteBySkuCode(String skuCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Inventory> findBySkuCode(String skuCode);
}