package com.onlineshopping.inventory_service.repository;

import com.onlineshopping.inventory_service.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT i FROM Inventory i WHERE i.skuCode IN :skuCodes")
    List<Inventory> findBySkuCodeIn(@Param("skuCodes") List<String> skuCode);


}